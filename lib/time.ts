import { useEffect, useState } from 'react';

const WIB_TZ = 'Asia/Jakarta';

export function nowWibEpoch(): number {
  // store as epoch (UTC-based), display in WIB
  return Date.now();
}

export function formatWibTime(epochMs: number): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: WIB_TZ,
    }).format(epochMs);
  } catch {
    const d = new Date(epochMs);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

export function formatWibDateTime(epochMs: number): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: WIB_TZ,
    }).format(epochMs);
  } catch {
    const d = new Date(epochMs);
    return d.toLocaleString();
  }
}

export function useNowWib(intervalMs: number = 1000): number {
  // small client hook for ticking WIB time in header
  const [now, setNow] = useState<number>(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}


