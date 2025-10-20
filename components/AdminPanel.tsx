"use client";

import type { Session } from "@/lib/types";

type Props = {
  isAdmin: boolean;
  adminUser?: { username: string; displayName: string } | null;
  onToggleAdmin: () => void;
  onReset: () => void;
  onOpenCheckIn: () => void;
  activeSession?: Session;
  onChangeSession?: (s: Session) => void;
};

export default function AdminPanel({ isAdmin, adminUser, onToggleAdmin, onReset, onOpenCheckIn, activeSession = 'PAGI', onChangeSession }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 mt-1 mb-1 p-2 bg-gradient-to-br from-emerald-50/50 to-white rounded-lg shadow-sm border border-emerald-50">
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-emerald-800">Sesi</label>
        <select
          value={activeSession}
          onChange={(e) => onChangeSession && onChangeSession(e.target.value as Session)}
          className={`rounded-lg border-2 px-2 py-1 text-xs font-semibold border-emerald-200 text-emerald-900 bg-white`}
        >
          <option value="PAGI">PAGI</option>
          <option value="SIANG">SIANG</option>
          <option value="SORE">SORE</option>
        </select>
      </div>
      <button
        onClick={onOpenCheckIn}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow hover:bg-emerald-700 active:bg-emerald-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 transition"
      >
        ABSENSI / CHECK-IN
      </button>
      <button
        onClick={onReset}
        disabled={!isAdmin}
        title={!isAdmin ? 'Hanya admin yang bisa reset antrian harian.' : ''}
        className={`rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 transition shadow ${!isAdmin ? 'opacity-50 cursor-not-allowed' : 'hover:bg-rose-100 active:bg-rose-200'}`}
      >
        Reset Harian
      </button>
      <button
        onClick={onToggleAdmin}
        className="ml-auto rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:bg-slate-100 flex items-center gap-2 shadow"
      >
        {isAdmin ? (<>
          <span className="inline-block text-emerald-600">🔐</span>Keluar Mode Admin</>) : (<><span className="inline-block text-slate-400">🛠️</span>Masuk Mode Admin</>)}
      </button>
      {isAdmin && adminUser && (
        <span className="rounded-lg bg-emerald-100 text-emerald-900 px-3 py-1 text-sm font-semibold ml-2">Admin: {adminUser.displayName}</span>
      )}
    </div>
  );
}


