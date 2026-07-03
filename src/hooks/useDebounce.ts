/**
 * useDebounce Hook
 *
 * Why: Search inputs that fire API calls on every keystroke
 * will hammer the backend. Debouncing delays the call until
 * the admin stops typing. Used in list pages with search.
 */

import { useState, useEffect } from "react";

export const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};