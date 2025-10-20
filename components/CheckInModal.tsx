"use client";

import { useMemo, useState } from "react";
import { useQueue } from "@/lib/queueContext";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function CheckInModal({ open, onClose }: Props) {
  const { guides, queue, checkIn, busyGuideIds, presentGuideIds } = useQueue();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    const alreadyQueued = new Set(queue.map(q => q.guide.id));
    return guides
      .filter(g => !alreadyQueued.has(g.id))
      // prevent re-check-in if guide already attended today in any session
      .filter(g => !presentGuideIds.has(g.id))
      // also prevent selection while busy in a slot
      .filter(g => !busyGuideIds.has(g.id))
      .filter(g => s ? (g.name.toLowerCase().includes(s) || g.languages.join(" ").toLowerCase().includes(s)) : true)
      .slice(0, 50);
  }, [guides, search, queue, busyGuideIds, presentGuideIds]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-emerald-100 relative animate-slide-up">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h3 className="text-xl font-bold text-emerald-700 font-sans">Absensi / Check-in</h3>
          <button onClick={onClose} className="rounded-full p-2 text-slate-500 hover:bg-slate-100 transition"><span className="text-lg">✕</span></button>
        </div>
        <div className="p-6 space-y-4">
          <input
            placeholder="Cari nama atau bahasa (ID, EN, ES, ... )"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border-2 border-emerald-200 px-4 py-3 text-base font-medium text-slate-800 placeholder-slate-400 bg-white outline-none focus:ring-2 focus:ring-emerald-300 transition"
          />
          <div className="max-h-64 overflow-auto rounded-lg border border-emerald-50">
            <ul className="divide-y divide-emerald-50">
              {filtered.map(g => (
                <li key={g.id} className={`flex items-center justify-between px-4 py-3 group hover:bg-emerald-50/80 transition-colors cursor-pointer rounded-lg ${selectedId === g.id ? 'bg-emerald-100/70 border-l-4 border-emerald-400' : ''}`}
                  onClick={() => setSelectedId(g.id)}>
                  <div>
                    <div className="text-base font-semibold text-slate-800">{g.name}</div>
                    <div className="text-xs font-medium text-slate-500">{g.languages.join(', ')}</div>
                  </div>
                  <input
                    type="radio"
                    name="guide-checkin"
                    checked={selectedId === g.id}
                    onChange={() => setSelectedId(g.id)}
                    className="accent-emerald-600 h-5 w-5"
                  />
                </li>
              ))}
              {!filtered.length && (
                <li className="px-4 py-10 text-center text-sm text-slate-400">Tidak ada hasil</li>
              )}
            </ul>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 border-t px-6 py-4 bg-emerald-50/30 rounded-b-2xl">
          <button onClick={onClose} className="rounded-lg border border-slate-200 bg-white px-5 py-2 text-base font-medium hover:bg-slate-50 active:bg-slate-100 transition">Batal</button>
          <button
            disabled={!selectedId}
            onClick={() => { if (selectedId) { checkIn(selectedId); onClose(); } }}
            className="rounded-lg bg-emerald-600 px-6 py-2 text-base font-bold text-white enabled:hover:bg-emerald-700 enabled:active:bg-emerald-800 enabled:shadow-lg disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            Check-in
          </button>
        </div>
      </div>
    </div>
  );
}


