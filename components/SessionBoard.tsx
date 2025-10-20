"use client";

import { useMemo, useState } from "react";
import { useQueue } from "@/lib/queueContext";
// times are displayed via timeLabel already in WIB

type Props = {
  isAdmin: boolean;
};

export default function SessionBoard({ isAdmin }: Props) {
  const { slots, assignToSlot, completeSlot, queue, guides, busyGuideIds } = useQueue();
  const [assigningSlotId, setAssigningSlotId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredCandidates = useMemo(() => {
    const s = search.trim().toLowerCase();
    // Candidates: those currently in Active Queue only (respect FCFS)
    const activeIds = new Set(queue.map(q => q.guide.id));
    const list = guides.filter(g => activeIds.has(g.id) && !busyGuideIds.has(g.id));
    return s ? list.filter(g => g.name.toLowerCase().includes(s) || g.languages.join(' ').toLowerCase().includes(s)) : list;
  }, [search, guides, queue, busyGuideIds]);

  return (
    <section className="mt-4">
      <h2 className="text-sm font-semibold text-emerald-800 mb-2">Slot Sesi</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {slots.map(slot => (
          <div key={slot.id} className="rounded-xl border bg-white/90 shadow p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-emerald-700">{slot.timeLabel} WIB</div>
              <div className="text-[10px] text-slate-400">Slot #{slot.id}</div>
            </div>
            {slot.guide ? (
              <div className="space-y-2">
                <div>
                  <div className="text-sm font-semibold text-slate-800">{slot.guide.name}</div>
                  <div className="text-xs text-slate-500">{slot.guide.languages.join(', ')}</div>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => completeSlot(slot.id)}
                    className="w-full rounded-md bg-emerald-600 text-white text-xs font-bold py-2 hover:bg-emerald-700"
                  >
                    Selesai Sesi / Ready
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-slate-400">Slot kosong</div>
                {isAdmin ? (
                  <button
                    onClick={() => setAssigningSlotId(slot.id)}
                    className="w-full rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-bold py-2 hover:bg-emerald-100"
                  >
                    Pilih Guide dari Antrian
                  </button>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>

      {assigningSlotId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl border p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-slate-800">Pilih Guide untuk Slot {assigningSlotId}</h3>
              <button onClick={() => setAssigningSlotId(null)} className="rounded p-1 text-slate-500 hover:bg-slate-100">✕</button>
            </div>
            <input
              placeholder="Cari dari antrian aktif"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
            />
            <ul className="mt-3 max-h-64 overflow-auto divide-y">
              {filteredCandidates.map(g => (
                <li key={g.id} className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-slate-800">{g.name}</div>
                    <div className="text-xs text-slate-500">{g.languages.join(', ')}</div>
                  </div>
                  <button
                    onClick={() => { assignToSlot(assigningSlotId, g.id); setAssigningSlotId(null); setSearch(''); }}
                    className="rounded-md bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 hover:bg-emerald-700"
                  >
                    Pilih
                  </button>
                </li>
              ))}
              {!filteredCandidates.length && (
                <li className="py-6 text-center text-xs text-slate-400">Tidak ada kandidat (cek antrian aktif)</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}


