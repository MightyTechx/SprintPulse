import { useState, useEffect, useRef } from 'react';
import { useDebounce } from './useDebounce';
import { fetchLocationSuggestions, type LocationResult } from '../utils/locationApi';

export type { LocationResult } from '../utils/locationApi';

export function useLocationSearch(minChars = 2) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (debouncedQuery.length < minChars) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);

    fetchLocationSuggestions(debouncedQuery, controller.signal)
      .then((data) => {
        setResults(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setResults([]);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery, minChars]);

  return {
    results,
    isLoading,
    setQuery,
    clear: () => {
      setQuery('');
      setResults([]);
    },
  };
}
