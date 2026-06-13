import { useState, useEffect } from 'react';

export interface LiveDateTime {
  hours: string;
  minutes: string;
  seconds: string;
  dateStr: string;
  tzAbbr: string;
  tzRegion: string;
  utcOffset: string;
}

export function useLiveDateTime(): LiveDateTime {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());

  const dateStr = now.toLocaleDateString(undefined, {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const tzAbbr =
    new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
      .formatToParts(now)
      .find((p) => p.type === 'timeZoneName')?.value || '';

  const iana = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tzRegion = iana.split('/').pop()?.replace(/_/g, ' ') || iana;

  const offsetMin = -now.getTimezoneOffset();
  const sign = offsetMin >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMin);
  const utcOffset = `UTC${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;

  return { hours, minutes, seconds, dateStr, tzAbbr, tzRegion, utcOffset };
}
