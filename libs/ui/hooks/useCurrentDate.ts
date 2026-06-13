import { useState, useEffect } from 'react';

export function useCurrentDate(interval = 60000, _format?: string): string {
  const [dateString, setDateString] = useState(() => new Date().toLocaleDateString());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateString(new Date().toLocaleDateString());
    }, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return dateString;
}
