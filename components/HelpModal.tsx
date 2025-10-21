"use client";

import { useState, useEffect } from "react";

export default function HelpModal({ isAdmin }: { isAdmin: boolean }) {
  const [open, setOpen] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    
    if (open) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open]);

  // Close modal when clicking backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Bantuan"
        title="Bantuan"
        className="rounded-full p-2 hover:bg-emerald-100 active:bg-emerald-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6 text-emerald-700" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 9a3.5 3.5 0 117 0c0 1.657-1 2.5-2 3s-1 1-1 2" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 17h.01" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          style={{ 
            paddingTop: 'max(env(safe-area-inset-top), 12px)', 
            paddingBottom: 'max(env(safe-area-inset-bottom), 12px)',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={handleBackdropClick}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-emerald-100 overflow-hidden"
            style={{ 
              maxHeight: 'calc(100vh - 48px)', 
              margin: '12px',
              animation: 'slideUp 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup bantuan"
              className="absolute right-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg hover:bg-emerald-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
              style={{ top: 'calc(max(env(safe-area-inset-top), 12px) + 8px)' }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Header */}
            <div className="px-5 pt-10 pb-4 sm:px-6 bg-linear-to-r from-emerald-50 to-white">
              <h3 id="modal-title" className="text-2xl font-extrabold text-emerald-800">
                Cara Pakai
              </h3>
              <p id="modal-description" className="mt-1 text-sm text-slate-600">
                Panduan singkat untuk menggunakan aplikasi ini. Mudah dan cepat.
              </p>
            </div>

            {/* Content */}
            <div 
              style={{ overflow: 'auto', maxHeight: 'calc(100vh - 240px)' }} 
              className="px-5 pb-6 sm:px-6"
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Guide Section */}
                <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-600/10 flex items-center justify-center text-emerald-700 font-bold">
                      G
                    </div>
                    <h4 className="text-lg font-semibold text-emerald-700">
                      Untuk Guide / Pengunjung
                    </h4>
                  </div>
                  <ol className="mt-3 ml-5 list-decimal space-y-2 text-slate-800 text-sm">
                    <li>Tekan tombol <strong>Check In</strong> untuk mendaftar ke antrian saat datang.</li>
                    <li>Tunggu nama Anda muncul di daftar antrian dan perhatikan posisi Anda.</li>
                    <li>Jika dipanggil, ikuti instruksi dari petugas untuk menuju lokasi.</li>
                    <li>Setelah selesai tugas, status Anda akan diperbarui sesuai proses.</li>
                  </ol>
                </div>

                {/* Admin Section */}
                {isAdmin ? (
                  <div className="rounded-lg border border-rose-100 bg-rose-50/30 p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-rose-600/10 flex items-center justify-center text-rose-700 font-bold">
                        A
                      </div>
                      <h4 className="text-lg font-semibold text-rose-700">
                        Untuk Admin
                      </h4>
                    </div>
                    <ol className="mt-3 ml-5 list-decimal space-y-2 text-slate-800 text-sm">
                      <li>Masuk ke <strong>Mode Admin</strong> untuk akses kontrol lanjutan.</li>
                      <li>Panggil guide, atur slot sesi, atau ubah urutan antrian jika diperlukan.</li>
                      <li>Gunakan fitur <strong>Reset</strong> hanya untuk membersihkan antrian kapan perlu.</li>
                      <li>Perubahan akan tersimpan dan tersinkronisasi secara otomatis.</li>
                    </ol>
                  </div>
                ) : (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
                        A
                      </div>
                      <h4 className="text-lg font-semibold text-slate-700">
                        Untuk Admin
                      </h4>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      Bagian Admin akan terlihat setelah Anda masuk Mode Admin.
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Tips */}
              <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50/30 p-4">
                <div className="flex items-start gap-3">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h5 className="font-semibold text-blue-800 text-sm">Tips</h5>
                    <p className="mt-1 text-sm text-slate-700">
                      Pastikan koneksi internet stabil untuk pengalaman terbaik. Refresh halaman jika ada masalah tampilan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 px-5 py-4 sm:px-6 bg-slate-50">
              <div className="text-sm text-slate-600 text-center sm:text-left">
                Butuh bantuan lebih lanjut? Hubungi petugas pengelola.
              </div>
              <button 
                onClick={() => setOpen(false)} 
                className="rounded-lg bg-emerald-600 px-6 py-2.5 text-white font-semibold hover:bg-emerald-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
              >
                Tutup
              </button>
            </div>
          </div>

          <style jsx>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
            
            @keyframes slideUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}