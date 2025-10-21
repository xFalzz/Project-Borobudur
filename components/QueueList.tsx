"use client";

import QueueItem from "./QueueItem";
import { QueueItem as QueueItemType } from "@/lib/types";

type Props = {
  items: QueueItemType[];
  isAdmin: boolean;
  onTurun: (guideId: number) => void;
  onTagEdit: (guideId: number) => void;
  onRemove?: (guideId: number) => void;
};

export default function QueueList({ items, isAdmin, onTurun, onTagEdit, onRemove }: Props) {
  if (!items.length) {
    return (
      <div className="rounded-xl border-2 border-dashed border-emerald-100 bg-white/80 p-10 text-center text-slate-400 shadow-lg min-h-[90px] animate-fade-in">
        <div className="font-semibold text-base mb-1">Antrian Kosong</div>
        <div className="text-xs">Belum ada antrian hari ini. Silakan lakukan check-in.</div>
      </div>
    );
  }
  return (
    <ul className="space-y-4 p-1 animate-fade-in">
      {items.map((item, idx) => (
        <QueueItem
          key={item.guide.id}
          item={item}
          index={idx}
          isAdmin={isAdmin}
          onTurun={onTurun}
          onTagEdit={onTagEdit}
          onRemove={onRemove}
        />)
      )}
    </ul>
  );
}


