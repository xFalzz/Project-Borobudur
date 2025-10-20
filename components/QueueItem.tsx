"use client";

import { QueueItem as QueueItemType } from "@/lib/types";
import { formatWibTime } from "@/lib/time";

type Props = {
  item: QueueItemType;
  index: number;
  isAdmin: boolean;
  onTurun: (guideId: number) => void;
  onTagEdit?: (guideId: number) => void;
};

export default function QueueItem({ item, index, isAdmin, onTurun, onTagEdit }: Props) {
  const { guide } = item;
  function formatTime(t: number|null) { return t ? formatWibTime(t) : ''; }
  return (
    <li className="group flex items-center justify-between gap-3 rounded-2xl border border-emerald-100 bg-white/90 px-4 py-3 shadow-sm hover:shadow-lg active:shadow transition-shadow duration-200 min-h-16">
      <div className="flex items-center gap-4 min-w-0">
        <span className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 via-white to-emerald-200 text-emerald-700 font-bold text-lg shadow-sm border border-emerald-200">
          {index + 1}
        </span>
        <div className="min-w-0 max-w-xs sm:max-w-sm md:max-w-md">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`truncate text-base font-semibold text-slate-800 ${isAdmin ? 'hover:underline hover:text-emerald-900 transition-colors' : ''}`}
              onClick={() => isAdmin && onTagEdit && onTagEdit(guide.id)}
            >
              {guide.name}
            </button>
            {guide.tag ? (
              <span className="inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold bg-gradient-to-br from-amber-100 to-yellow-50 text-yellow-900 border border-yellow-200 shadow-sm">
                {guide.tag}
              </span>
            ) : null}
          </div>
          <div className="mt-1 text-xs text-slate-500 truncate">
            {guide.languages.join(", ")}
            {guide.checkInTime ? (
              <>
                <span className="mx-2 text-gray-300">·</span>
                <span className="text-xs text-gray-400 ">Check-in: {formatTime(guide.checkInTime)} WIB</span>
              </>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isAdmin && (
          <button
            onClick={() => onTurun(guide.id)}
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs md:text-sm font-medium text-emerald-700 hover:bg-emerald-100 active:bg-emerald-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 focus-visible:ring-offset-1"
          >
            Turun Antrian
          </button>
        )}
      </div>
    </li>
  );
}


