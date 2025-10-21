"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { Guide, QueueItem, Session, SessionSlot } from "./types";
import { guides as masterGuides } from "./data/guides";
import { nowWibEpoch } from "./time";

type Action =
  | { type: 'INIT'; payload: QueueItem[] }
  | { type: 'CHECK_IN'; payload: { guideId: number } }
  | { type: 'TURUN'; payload: { guideId: number } }
  | { type: 'REMOVE_FROM_QUEUE'; payload: { guideId: number } }
  | { type: 'MOVE_TO_NEXT_SESSION'; payload: { guideId: number; fromSession: Session } }
  | { type: 'REQUEUE'; payload: { guideId: number } }
  | { type: 'RESET' }
  | { type: 'SET_TAG'; payload: { guideId: number; tag: string | null } }
  | { type: 'INIT_SLOTS'; payload: SessionSlot[] }
  | { type: 'ASSIGN_TO_SLOT'; payload: { slotId: number; guideId: number } }
  | { type: 'COMPLETE_SLOT'; payload: { slotId: number; guideId?: number } };

function storageKey(session: Session): string { return `borobudur.queue.${session}`; }
function storageKeySlots(session: Session): string { return `borobudur.slots.${session}`; }

function persist(items: QueueItem[], session: Session) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKey(session), JSON.stringify(items));
  localStorage.setItem('borobudur.session', session);
}

function loadPersisted(session: Session): QueueItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKey(session));
    if (!raw) return [];
    const parsed: QueueItem[] = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function sessionLabels(session: Session): string[] {
  if (session === 'PAGI') return ["08:30","09:30","10:30","11:30"];
  if (session === 'SIANG') return ["12:30","13:30","14:30","15:30"];
  // Default SORE block; adjust as needed
  return ["16:30","17:30","18:30","19:30"];
}

function defaultSlotsFor(session: Session): SessionSlot[] {
  const labels = sessionLabels(session);
  return labels.map((l, i) => ({ id: i+1, timeLabel: l, guides: [], capacity: 5 }));
}

function persistSlots(slots: SessionSlot[], session: Session) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(storageKeySlots(session), JSON.stringify(slots));
}

function loadPersistedSlots(session: Session): SessionSlot[] {
  if (typeof window === 'undefined') return defaultSlotsFor(session);
  try {
    const raw = localStorage.getItem(storageKeySlots(session));
    const fallback = defaultSlotsFor(session);
    if (!raw) return fallback;
    const parsedRaw = JSON.parse(raw);
    if (!Array.isArray(parsedRaw)) return fallback;
    // If labels length mismatched with session definition, reset
    const labels = sessionLabels(session);
    if (parsedRaw.length !== labels.length || parsedRaw.some((s: unknown, i: number) => {
      if (typeof s !== 'object' || s === null) return true;
      const timeLabel = (s as Record<string, unknown>).timeLabel;
      return typeof timeLabel !== 'string' || timeLabel !== labels[i];
    })) {
      return fallback;
    }
    // Normalize older format where 'guide' existed into new { guides: [] } shape
    const normalized: SessionSlot[] = parsedRaw.map((s: unknown) => {
      const obj = s as Record<string, unknown>;
      const id = typeof obj.id === 'number' ? obj.id : 0;
      const timeLabel = typeof obj.timeLabel === 'string' ? obj.timeLabel : '';
      const capacity = typeof obj.capacity === 'number' ? obj.capacity : 3;
      const guides: Guide[] = [];
      const guideVal = obj['guide'];
      if (guideVal && typeof guideVal === 'object' && (guideVal as Record<string, unknown>)['id'] && typeof (guideVal as Record<string, unknown>)['id'] === 'number') {
        const g = guideVal as Record<string, unknown>;
        guides.push({ id: g.id as number, name: String(g.name || ''), languages: Array.isArray(g.languages) ? (g.languages as string[]) : [], checkInTime: typeof g.checkInTime === 'number' ? g.checkInTime : null, tag: typeof g.tag === 'string' ? g.tag : null });
      } else if (Array.isArray(obj['guides'])) {
        (obj['guides'] as unknown[]).forEach((g) => {
          if (g && typeof g === 'object' && (g as Record<string, unknown>)['id'] && typeof (g as Record<string, unknown>)['id'] === 'number') {
            const gg = g as Record<string, unknown>;
            guides.push({ id: gg.id as number, name: String(gg.name || ''), languages: Array.isArray(gg.languages) ? (gg.languages as string[]) : [], checkInTime: typeof gg.checkInTime === 'number' ? gg.checkInTime : null, tag: typeof gg.tag === 'string' ? gg.tag : null });
          }
        });
      }
      return { id, timeLabel, guides, capacity };
    });
    return normalized;
  } catch {
    return defaultSlotsFor(session);
  }
}

function reducer(state: QueueItem[], action: Action): QueueItem[] {
  switch (action.type) {
    case 'INIT':
      return action.payload;
    case 'CHECK_IN': {
      const guide = masterGuides.find(g => g.id === action.payload.guideId);
      if (!guide) return state;
      const exists = state.some(q => q.guide.id === guide.id);
      if (exists) return state;
      const now = nowWibEpoch();
      const newItem: QueueItem = { guide: { ...guide, checkInTime: now }, status: 'ACTIVE' };
      return [...state, newItem];
    }
    case 'TURUN': {
      const index = state.findIndex(q => q.guide.id === action.payload.guideId);
      if (index === -1) return state;
      const item = state[index];
      const remaining = state.filter(q => q.guide.id !== action.payload.guideId);
      // re-append to tail
      return [...remaining, item];
    }
    case 'REMOVE_FROM_QUEUE': {
      return state.filter(q => q.guide.id !== action.payload.guideId);
    }
    case 'MOVE_TO_NEXT_SESSION': {
      // For MOVE_TO_NEXT_SESSION in reducer we simply remove from current queue; actual pushing to next session's storage is handled outside this reducer via side-effects
      return state.filter(q => q.guide.id !== action.payload.guideId);
    }
    case 'REQUEUE': {
      // remove any existing occurrences and append to tail with updated checkInTime
      const remaining = state.filter(q => q.guide.id !== action.payload.guideId);
      const g = masterGuides.find(m => m.id === action.payload.guideId);
      if (!g) return remaining;
      const item: QueueItem = { guide: { ...g, checkInTime: nowWibEpoch() }, status: 'ACTIVE' };
      return [...remaining, item];
    }
    case 'RESET':
      return [];
    case 'SET_TAG': {
      return state.map(q => q.guide.id === action.payload.guideId ? ({ ...q, guide: { ...q.guide, tag: action.payload.tag ?? null } }) : q);
    }
    default:
      return state;
  }
}

type ContextValue = {
  queue: QueueItem[];
  guides: Guide[];
  activeSession: Session;
  setActiveSession: (s: Session) => void;
  slots: SessionSlot[];
  busyGuideIds: Set<number>;
  presentGuideIds: Set<number>; // union of all queues and slots across sessions (attendance today)
  checkIn: (guideId: number) => void;
  turun: (guideId: number) => void;
  resetQueue: () => void;
  setTag: (guideId: number, tag: string | null) => void;
  assignToSlot: (slotId: number, guideId: number) => void;
  completeSlot: (slotId: number, guideId?: number) => void;
  removeFromQueue: (guideId: number) => void;
  moveToNextSession: (guideId: number, fromSession: Session) => void;
};

const QueueContext = createContext<ContextValue | null>(null);

export function QueueProvider({ children }: { children: React.ReactNode }) {
  const [queue, dispatch] = useReducer(reducer, []);
  const [activeSession, setActiveSession] = useState<Session>(() => {
    if (typeof window === 'undefined') return 'PAGI';
    const saved = (localStorage.getItem('borobudur.session') as Session) || 'PAGI';
    return saved === 'PAGI' || saved === 'SIANG' || saved === 'SORE' ? saved : 'PAGI';
  });
  const [slots, setSlots] = useState<SessionSlot[]>(defaultSlotsFor('PAGI'));
  const [busyGuideIds, setBusyGuideIds] = useState<Set<number>>(new Set());
  const [presentGuideIds, setPresentGuideIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const initial = loadPersisted(activeSession);
    dispatch({ type: 'INIT', payload: initial });
    const s = loadPersistedSlots(activeSession);
    setSlots(s);
  }, [activeSession]);

  useEffect(() => {
    persist(queue, activeSession);
  }, [queue, activeSession]);

  useEffect(() => {
    persistSlots(slots, activeSession);
  }, [slots, activeSession]);

  // compute busy guides across ALL sessions so a guide in another session cannot be picked
  useEffect(() => {
    const sessions: Session[] = ['PAGI','SIANG','SORE'];
    const ids = new Set<number>();
    sessions.forEach(s => {
      const sslots = loadPersistedSlots(s);
      sslots.forEach(sl => { (sl.guides || []).forEach(g => ids.add(g.id)); });
    });
    setBusyGuideIds(ids);
  }, [slots, activeSession]);

  // compute present/attended guides across ALL sessions (in any queue or slot)
  useEffect(() => {
    const sessions: Session[] = ['PAGI','SIANG','SORE'];
    const ids = new Set<number>();
    sessions.forEach(s => {
      const q = loadPersisted(s);
      q.forEach(item => ids.add(item.guide.id));
      const sslots = loadPersistedSlots(s);
      sslots.forEach(sl => { (sl.guides || []).forEach(g => ids.add(g.id)); });
    });
    setPresentGuideIds(ids);
  }, [queue, slots, activeSession]);

  const checkIn = useCallback((guideId: number) => dispatch({ type: 'CHECK_IN', payload: { guideId } }), []);
  const turun = useCallback((guideId: number) => dispatch({ type: 'TURUN', payload: { guideId } }), []);
  const resetQueue = useCallback(() => dispatch({ type: 'RESET' }), []);
  const setTag = useCallback((guideId: number, tag: string | null) => dispatch({ type: 'SET_TAG', payload: { guideId, tag } }), []);
  const assignToSlot = useCallback((slotId: number, guideId: number) => {
    // remove from queue and put into slot (append to guides array if capacity allows)
    setSlots(prev => prev.map(s => {
      if (s.id !== slotId) return s;
      const capacity = s.capacity ?? 3;
      const existing = s.guides || [];
      if (existing.find(g => g.id === guideId)) return s; // already in slot
      if (existing.length >= capacity) return s; // no space
      const g = masterGuides.find(m => m.id === guideId);
      if (!g) return s;
      return { ...s, guides: [...existing, { ...g }] };
    }));
    const remaining = queue.filter(q => q.guide.id !== guideId);
    dispatch({ type: 'INIT', payload: remaining });
  }, [queue]);

  const completeSlot = useCallback((slotId: number, guideId?: number) => {
    setSlots(prev => prev.map(s => {
      if (s.id !== slotId) return s;
      // If guideId provided, remove only that guide from slot and move to next session
      if (guideId) {
        const remainingGuides = (s.guides || []).filter(g => g.id !== guideId);
        // requeue guide back to current session queue tail
        dispatch({ type: 'REQUEUE', payload: { guideId } });
        return { ...s, guides: remainingGuides };
      }
      // Otherwise, complete all guides in this slot (requeue them)
      (s.guides || []).forEach(g => dispatch({ type: 'REQUEUE', payload: { guideId: g.id } }));
      return { ...s, guides: [] };
    }));
  }, []);

  function nextSessionOf(s: Session): Session | null {
    if (s === 'PAGI') return 'SIANG';
    if (s === 'SIANG') return 'SORE';
    return null; // Sore is last
  }

  const removeFromQueue = useCallback((guideId: number) => {
    dispatch({ type: 'REMOVE_FROM_QUEUE', payload: { guideId } });
  }, []);

  const moveToNextSession = useCallback((guideId: number, fromSession: Session) => {
    const next = nextSessionOf(fromSession);
    if (!next) return; // no next
    // remove locally from current queue
    dispatch({ type: 'MOVE_TO_NEXT_SESSION', payload: { guideId, fromSession } });
    // load persisted next session queue and append guide (if not present)
    const nextQueue = loadPersisted(next);
    const exists = nextQueue.some(q => q.guide.id === guideId);
    if (exists) return;
    // find guide in masterGuides
    const g = masterGuides.find(m => m.id === guideId);
    if (!g) return;
  const newItem: QueueItem = { guide: { ...g, checkInTime: nowWibEpoch() }, status: 'ACTIVE' };
    const appended = [...nextQueue, newItem];
    persist(appended, next);
  }, []);

  const value = useMemo<ContextValue>(() => ({
    queue,
    guides: masterGuides,
    activeSession,
    setActiveSession,
    slots,
    busyGuideIds,
    presentGuideIds,
    checkIn,
    turun,
    resetQueue,
    setTag,
    assignToSlot,
    completeSlot,
    removeFromQueue,
    moveToNextSession,
  }), [queue, activeSession, slots, busyGuideIds, presentGuideIds, checkIn, turun, resetQueue, setTag, assignToSlot, completeSlot, removeFromQueue, moveToNextSession]);

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
}

export function useQueue() {
  const ctx = useContext(QueueContext);
  if (!ctx) throw new Error('useQueue must be used within QueueProvider');
  return ctx;
}


