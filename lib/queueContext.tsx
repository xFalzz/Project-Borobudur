"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { Guide, QueueItem, Session, SessionSlot } from "./types";
import { guides as masterGuides } from "./data/guides";
import { nowWibEpoch } from "./time";

type Action =
  | { type: 'INIT'; payload: QueueItem[] }
  | { type: 'CHECK_IN'; payload: { guideId: number } }
  | { type: 'TURUN'; payload: { guideId: number } }
  | { type: 'RESET' }
  | { type: 'SET_TAG'; payload: { guideId: number; tag: string | null } }
  | { type: 'INIT_SLOTS'; payload: SessionSlot[] }
  | { type: 'ASSIGN_TO_SLOT'; payload: { slotId: number; guideId: number } }
  | { type: 'COMPLETE_SLOT'; payload: { slotId: number } };

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
  return labels.map((l, i) => ({ id: i+1, timeLabel: l, guide: null }));
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
    const parsed: SessionSlot[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    // If labels length mismatched with session definition, reset
    const labels = sessionLabels(session);
    if (parsed.length !== labels.length || parsed.some((s, i) => s.timeLabel !== labels[i])) {
      return fallback;
    }
    return parsed;
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
  completeSlot: (slotId: number) => void;
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
      sslots.forEach(sl => { if (sl.guide) ids.add(sl.guide.id); });
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
      sslots.forEach(sl => { if (sl.guide) ids.add(sl.guide.id); });
    });
    setPresentGuideIds(ids);
  }, [queue, slots, activeSession]);

  const checkIn = useCallback((guideId: number) => dispatch({ type: 'CHECK_IN', payload: { guideId } }), []);
  const turun = useCallback((guideId: number) => dispatch({ type: 'TURUN', payload: { guideId } }), []);
  const resetQueue = useCallback(() => dispatch({ type: 'RESET' }), []);
  const setTag = useCallback((guideId: number, tag: string | null) => dispatch({ type: 'SET_TAG', payload: { guideId, tag } }), []);
  const assignToSlot = useCallback((slotId: number, guideId: number) => {
    // remove from queue and put into slot
    setSlots(prev => prev.map(s => s.id === slotId ? ({ ...s, guide: masterGuides.find(g => g.id === guideId) || null }) : s));
    // removing from queue handled by reducer-like local update: filter out here by dispatching TURUN with reorder? We'll just filter locally by dispatching a RESET-like? Simpler: manual state replace via INIT
    const remaining = queue.filter(q => q.guide.id !== guideId);
    dispatch({ type: 'INIT', payload: remaining });
  }, [queue]);
  const completeSlot = useCallback((slotId: number) => {
    setSlots(prev => {
      const slot = prev.find(s => s.id === slotId);
      if (!slot || !slot.guide) return prev;
      const guide = slot.guide;
      // push back to tail preserving original checkInTime
      const newItem: QueueItem = { guide: { ...guide }, status: 'ACTIVE' };
      dispatch({ type: 'INIT', payload: [...queue, newItem] });
      return prev.map(s => s.id === slotId ? ({ ...s, guide: null }) : s);
    });
  }, [queue]);

  const value = useMemo<ContextValue>(() => ({ queue, guides: masterGuides, activeSession, setActiveSession, slots, busyGuideIds, presentGuideIds, checkIn, turun, resetQueue, setTag, assignToSlot, completeSlot }), [queue, activeSession, slots, busyGuideIds, presentGuideIds, checkIn, turun, resetQueue, setTag, assignToSlot, completeSlot]);

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
}

export function useQueue() {
  const ctx = useContext(QueueContext);
  if (!ctx) throw new Error('useQueue must be used within QueueProvider');
  return ctx;
}


