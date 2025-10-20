"use client";

import Header from "@/components/Header";
import QueueList from "@/components/QueueList";
import AdminPanel from "@/components/AdminPanel";
import CheckInModal from "@/components/CheckInModal";
import SessionBoard from "@/components/SessionBoard";
import { QueueProvider, useQueue } from "@/lib/queueContext";
import { useCallback, useEffect, useMemo, useState } from "react";

function PageInner() {
  const adminUsers = [
    { username: 'korlap1', password: 'borobudur1', displayName: 'Korlap A' },
    { username: 'korlap2', password: 'borobudur2', displayName: 'Korlap B' },
  ];
  const { queue, turun, setTag } = useQueue();
  const [adminUser, setAdminUser] = useState<null | { username: string; displayName: string }>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { activeSession, setActiveSession } = useQueue();
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState("");
  const [adminLoginForm, setAdminLoginForm] = useState({ username: '', password: '' });
  const [openCheckIn, setOpenCheckIn] = useState(false);
  const [editingGuideId, setEditingGuideId] = useState<number | null>(null);
  const [tempTag, setTempTag] = useState<string>("");

  // Toggle admin logic
  const onToggleAdmin = () => {
    if (adminUser) {
      setAdminUser(null);
      setIsAdmin(false);
      setAdminLoginForm({ username: '', password: '' });
    } else {
      setAdminModalOpen(true);
      setAdminLoginForm({ username: '', password: '' });
      setAdminLoginError("");
    }
  };
  const doAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const found = adminUsers.find(
      (u) => u.username === adminLoginForm.username.trim() && u.password === adminLoginForm.password
    );
    if (found) {
      setAdminUser({ username: found.username, displayName: found.displayName });
      setIsAdmin(true);
      setAdminModalOpen(false);
    } else {
      setAdminLoginError('Login gagal. Username/password salah.');
    }
  };
  const closeAdminModal = () => {
    setAdminModalOpen(false);
    setAdminLoginError("");
  };

  // Disable non-admin actions
  const onTurun = useCallback(
    (guideId: number) => { if (isAdmin) turun(guideId); },
    [turun, isAdmin],
  );
  const onTagEdit = useCallback(
    (guideId: number) => { if (isAdmin) { setEditingGuideId(guideId); setTempTag(""); } },
    [isAdmin],
  );
  const sortedQueue = useMemo(() => queue, [queue]);

  return (
    <div className="min-h-[90vh] px-0 py-0 md:py-8 md:px-4 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 md:flex md:flex-col md:items-center">
      <div className="w-full md:max-w-3xl lg:max-w-4xl mx-auto rounded-xl shadow-lg bg-white/90 border border-emerald-100 mt-0 md:mt-6 mb-0 md:mb-12 p-0 md:p-8 transition-colors">
  <Header isAdmin={isAdmin} />
        <div className="pt-2 pb-1 px-2 md:px-0">
          <AdminPanel
            isAdmin={isAdmin}
            adminUser={adminUser}
            onToggleAdmin={onToggleAdmin}
            onReset={() => {
              if (isAdmin) {
                const ev = new CustomEvent("BOROBUDUR_RESET");
                window.dispatchEvent(ev);
              }
            }}
            onOpenCheckIn={() => setOpenCheckIn(true)}
            activeSession={activeSession}
            onChangeSession={(s) => setActiveSession(s)}
          />
        </div>
        <div className="my-6 md:my-10 px-2 md:px-0">
          <QueueList
            items={sortedQueue}
            isAdmin={isAdmin}
            onTurun={onTurun}
            onTagEdit={onTagEdit}
          />
          <div className="mt-8">
            <SessionBoard isAdmin={isAdmin} />
          </div>
        </div>
      </div>
      <CheckInModal open={openCheckIn} onClose={() => setOpenCheckIn(false)} />
      {/* Modal Login Admin */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 animate-fade-in">
          <form
            onSubmit={doAdminLogin}
            className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-emerald-100 animate-slide-up px-8 pt-10 pb-4 flex flex-col gap-4"
          >
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-bold text-emerald-800">Login Admin</h3>
              <button type="button" onClick={closeAdminModal} className="text-2xl text-gray-400 hover:text-emerald-500">&times;</button>
            </div>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Username</span>
              <input
                autoFocus
                type="text"
                value={adminLoginForm.username}
                onChange={e => setAdminLoginForm({ ...adminLoginForm, username: e.target.value })}
                className="w-full mt-1 rounded-lg border-2 border-emerald-200 px-4 py-2 text-base text-slate-800 placeholder-slate-400 bg-white outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="Username"
                autoComplete="username"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Password</span>
              <input
                type="password"
                value={adminLoginForm.password}
                onChange={e => setAdminLoginForm({ ...adminLoginForm, password: e.target.value })}
                className="w-full mt-1 rounded-lg border-2 border-emerald-200 px-4 py-2 text-base text-slate-800 placeholder-slate-400 bg-white outline-none focus:ring-2 focus:ring-emerald-300"
                placeholder="Password"
                autoComplete="current-password"
              />
            </label>
            {adminLoginError && <div className="text-red-600 text-sm font-medium">{adminLoginError}</div>}
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-6 py-2 text-base font-bold text-white enabled:hover:bg-emerald-700 enabled:active:bg-emerald-800 enabled:shadow-lg transition disabled:opacity-50"
              disabled={!adminLoginForm.username.trim() || !adminLoginForm.password}
            >
              Login
            </button>
          </form>
        </div>
      )}

      {editingGuideId !== null && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white shadow-2xl border border-gray-100 animate-fade-in">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-base font-semibold text-slate-800">Edit Tag/Keterangan</h3>
              <button onClick={() => setEditingGuideId(null)} className="rounded p-1 text-slate-500 hover:bg-slate-100">✕</button>
            </div>
            <div className="p-4 space-y-3">
              <input
                autoFocus
                placeholder="Contoh: [ES REQ] atau [LOCAL DULU]"
                value={tempTag}
                onChange={e => setTempTag(e.target.value)}
                className="w-full rounded-md border px-3 py-2 text-base text-slate-800 placeholder-slate-400 outline-none focus:ring-2 focus:ring-emerald-300"
              />
            </div>
            <div className="flex items-center justify-end gap-2 border-t px-4 py-3">
              <button onClick={() => setEditingGuideId(null)} className="rounded-md border bg-white px-3 py-2 text-base">Batal</button>
              <button
                onClick={() => { if (editingGuideId !== null) { setTag(editingGuideId, tempTag.trim() || null); setEditingGuideId(null); } }}
                className="rounded-md bg-emerald-600 px-3 py-2 text-base font-medium text-white hover:bg-emerald-700"
              >
                Simpan
              </button>
              <button
                onClick={() => { if (editingGuideId !== null) { setTag(editingGuideId, null); setEditingGuideId(null); } }}
                className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-base font-medium text-rose-700 hover:bg-rose-100"
              >
                Hapus Tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <QueueProvider>
      <ResetListener />
      <PageInner />
    </QueueProvider>
  );
}

function ResetListener() {
  const { resetQueue } = useQueue();
  // bridge AdminPanel button to context without prop drilling
  useEffect(() => {
    function onReset() { resetQueue(); }
    window.addEventListener('BOROBUDUR_RESET', onReset);
    return () => window.removeEventListener('BOROBUDUR_RESET', onReset);
  }, [resetQueue]);
  return null;
}
