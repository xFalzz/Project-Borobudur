"use client";

import { useState } from "react";

export default function HelpModal({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        aria-label="Bantuan"
        title="Bantuan"
        className="rounded-full p-2 hover:bg-emerald-100 active:bg-emerald-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 9a3.5 3.5 0 117 0c0 1.657-1 2.5-2 3s-1 1-1 2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40"
          style={{ paddingTop: 'env(safe-area-inset-top, 12px)', paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-emerald-50 overflow-hidden animate-fade-in"
            style={{ maxHeight: 'calc(100vh - 48px)', margin: '12px' }}
          >
            {/* Close button - prominent; offset by safe-area to avoid notch */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup bantuan"
              className="absolute right-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow hover:bg-emerald-700 focus:outline-none"
              style={{ top: 'calc(env(safe-area-inset-top, 12px) + 8px)' }}
            >
              <span className="font-bold text-lg">×</span>
            </button>

            <div className="px-5 pt-10 pb-4 sm:px-6">
              <h3 className="text-2xl font-extrabold text-emerald-800">Cara Pakai</h3>
              <p className="mt-1 text-sm text-slate-600">Panduan singkat untuk menggunakan aplikasi ini. Mudah dan cepat.</p>
            </div>
            <div style={{ overflow: 'auto', maxHeight: 'calc(100vh - 180px)' }} className="px-5 pb-6 sm:px-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-emerald-50 bg-emerald-50/40 p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-700 font-bold">G</div>
                    <h4 className="text-lg font-semibold text-emerald-700">Untuk Guide / Pengunjung</h4>
                  </div>
                  <ol className="mt-3 ml-5 list-decimal space-y-2 text-slate-800">
                    <li>Tekan tombol Check In untuk mendaftar ke antrian saat datang.</li>
                    <li>Tunggu nama Anda muncul di daftar antrian dan perhatikan posisi Anda.</li>
                    <li>Jika dipanggil, ikuti instruksi dari petugas untuk menuju lokasi.</li>
                    <li>Setelah selesai tugas, status Anda akan diperbarui sesuai proses.</li>
                  </ol>
                </div>

                {isAdmin ? (
                  <div className="rounded-lg border border-rose-50 bg-rose-50/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-rose-600/10 flex items-center justify-center text-rose-700 font-bold">A</div>
                      <h4 className="text-lg font-semibold text-rose-700">Untuk Admin</h4>
                    </div>
                    <ol className="mt-3 ml-5 list-decimal space-y-2 text-slate-800">
                      <li>Masuk ke Mode Admin untuk akses kontrol lanjutan.</li>
                      <li>Panggil guide, atur slot sesi, atau ubah urutan antrian jika diperlukan.</li>
                      <li>Gunakan fitur Reset hanya untuk membersihkan antrian kapan perlu.</li>
                      <li>Perubahan akan tersimpan lokal dan terlihat di browser yang sama.</li>
                    </ol>
                  </div>
                ) : (
                  <div className="rounded-lg border border-slate-100 bg-white p-4 opacity-90">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">A</div>
                      <h4 className="text-lg font-semibold text-slate-700">Untuk Admin</h4>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">Bagian Admin akan terlihat setelah Anda masuk Mode Admin.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t px-5 py-4 sm:px-6 bg-white">
              <div className="text-sm text-slate-600">Butuh bantuan lebih lanjut? Hubungi petugas pengelola.</div>
              <div>
                <button onClick={() => setOpen(false)} className="rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700">Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
