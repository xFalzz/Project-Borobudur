"use client";

import { formatWibDateTime, useNowWib } from "@/lib/time";
import HelpModal from "@/components/HelpModal";

export default function Header({ isAdmin }: { isAdmin?: boolean }) {
  const now = useNowWib(1000);
  return (
    <header className="sticky top-0 z-20 w-full border-b border-emerald-100 bg-gradient-to-tr from-emerald-50/70 to-white/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto w-full max-w-3xl lg:max-w-4xl px-4 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-700 tracking-tight font-sans drop-shadow-sm select-none">
            Sistem Antrian HPI Borobudur
          </h1>
          <div className="mt-1 text-xs md:text-sm text-emerald-900/80 font-medium">
            {formatWibDateTime(now)} WIB
          </div>
        </div>
        <div className="flex items-center gap-3">
          <HelpModal isAdmin={!!isAdmin} />
        </div>
      </div>
    </header>
  );
}


