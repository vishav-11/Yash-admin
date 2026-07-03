"use client";

/**
 * useLocalStorage Hook
 *
 * Why: A React-aware wrapper around localStorage that:
 * - Returns state that triggers re-renders on change
 * - Syncs across browser tabs (via the "storage" event)
 * - Handles SSR safely (no window access on server)
 * - Handles JSON parse/stringify automatically
 * - Falls back to initialValue if key doesn't exist or parsing fails
 *
 * Usage:
 *   const [theme, setTheme] = useLocalStorage("theme", "dark");
 *   const [admin, setAdmin, removeAdmin] = useLocalStorage<Admin | null>("admin", null);
 *
 * vs raw localStorage:
 *   localStorage.setItem("theme", JSON.stringify("dark")) ← no re-render
 *   useLocalStorage("theme", "dark")                      ← triggers re-render ✅
 */

import { useState, useEffect, useCallback, useRef } from "react";

type SetValue<T> = (value: T | ((prevValue: T) => T)) => void;
type RemoveValue = () => void;

type UseLocalStorageReturn<T> = [
  value: T,
  setValue: SetValue<T>,
  removeValue: RemoveValue,
];

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): UseLocalStorageReturn<T> => {
  // ── Track key in a ref so we can detect key changes ───────────────────────
  const keyRef = useRef(key);

  // ── Read initial value from localStorage ──────────────────────────────────
  const readFromStorage = useCallback((): T => {
    // SSR guard — localStorage is not available on server
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const raw = window.localStorage.getItem(key);

      if (raw === null) {
        // Key doesn't exist yet — return and persist initial value
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        return initialValue;
      }

      return JSON.parse(raw) as T;
    } catch (error) {
      // JSON.parse failed or localStorage access denied
      console.warn(
        `[useLocalStorage] Failed to read key "${key}" from localStorage:`,
        error
      );
      return initialValue;
    }
  }, [key, initialValue]);

  // ── State ──────────────────────────────────────────────────────────────────
  const [storedValue, setStoredValue] = useState<T>(readFromStorage);

  // ── Re-read from storage if key changes ───────────────────────────────────
  useEffect(() => {
    if (keyRef.current !== key) {
      keyRef.current = key;
      setStoredValue(readFromStorage());
    }
  }, [key, readFromStorage]);

  // ── setValue: write to localStorage + trigger re-render ───────────────────
  const setValue: SetValue<T> = useCallback(
    (value) => {
      if (typeof window === "undefined") {
        console.warn(
          `[useLocalStorage] Cannot set key "${key}" during SSR.`
        );
        return;
      }

      try {
        // Support functional updates: setValue(prev => prev + 1)
        setStoredValue((prevValue) => {
          const nextValue =
            typeof value === "function"
              ? (value as (prev: T) => T)(prevValue)
              : value;

          window.localStorage.setItem(key, JSON.stringify(nextValue));

          // Dispatch a custom event so other hook instances on the
          // SAME tab can sync (the native "storage" event only fires
          // for OTHER tabs)
          window.dispatchEvent(
            new CustomEvent("local-storage-change", {
              detail: { key, newValue: nextValue },
            })
          );

          return nextValue;
        });
      } catch (error) {
        console.error(
          `[useLocalStorage] Failed to write key "${key}" to localStorage:`,
          error
        );
      }
    },
    [key]
  );

  // ── removeValue: delete from localStorage + reset to initialValue ─────────
  const removeValue: RemoveValue = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.removeItem(key);

      setStoredValue(initialValue);

      window.dispatchEvent(
        new CustomEvent("local-storage-change", {
          detail: { key, newValue: undefined },
        })
      );
    } catch (error) {
      console.error(
        `[useLocalStorage] Failed to remove key "${key}" from localStorage:`,
        error
      );
    }
  }, [key, initialValue]);

  // ── Cross-tab sync via native "storage" event ─────────────────────────────
  useEffect(() => {
    const handleNativeStorageChange = (event: StorageEvent) => {
      // Only react to changes for our specific key
      if (event.key !== key) return;

      // Another tab removed the key
      if (event.newValue === null) {
        setStoredValue(initialValue);
        return;
      }

      try {
        setStoredValue(JSON.parse(event.newValue) as T);
      } catch {
        setStoredValue(initialValue);
      }
    };

    // ── Same-tab sync via custom event ────────────────────────────────────
    const handleCustomStorageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{
        key: string;
        newValue: T | undefined;
      }>;

      if (customEvent.detail.key !== key) return;

      if (customEvent.detail.newValue === undefined) {
        setStoredValue(initialValue);
        return;
      }

      setStoredValue(customEvent.detail.newValue);
    };

    window.addEventListener("storage", handleNativeStorageChange);
    window.addEventListener("local-storage-change", handleCustomStorageChange);

    return () => {
      window.removeEventListener("storage", handleNativeStorageChange);
      window.removeEventListener(
        "local-storage-change",
        handleCustomStorageChange
      );
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};