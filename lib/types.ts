export interface Guide {
  id: number;
  name: string;
  languages: string[];
  checkInTime: number | null;
  tag?: string | null;
}

export type QueueStatus = 'ACTIVE' | 'MANDU';

export interface QueueItem {
  guide: Guide;
  status: QueueStatus;
}

export type Session = 'PAGI' | 'SIANG' | 'SORE';

export interface SessionSlot {
  id: number; // 1..8
  timeLabel: string; // e.g., "08:30"
  guides: Guide[]; // multiple guides per slot
  capacity?: number; // max guides allowed in this slot
}


