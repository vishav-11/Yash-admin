"use client";

/**
 * useToast Hook + Toast Store
 *
 * Why: Toast notifications are triggered from anywhere —
 * form submissions, API errors, success callbacks, hooks.
 * They need global state so any component can dispatch a toast
 * without prop drilling.
 *
 * Architecture:
 *   useToastStore (Zustand) — owns toast queue state
 *   useToast (hook)         — public API for dispatching toasts
 *   ToastContainer          — renders active toasts (in layout)
 *
 * Usage (in any component or hook):
 *   const { toast } = useToast();
 *   toast.success("Photo uploaded successfully!");
 *   toast.error("Failed to delete photo.");
 *   toast.warning("File size is close to the limit.");
 *   toast.info("Changes are saved automatically.");
 *
 * Advanced usage:
 *   toast.custom({
 *     title: "Upload complete",
 *     description: "3 photos were uploaded.",
 *     variant: "success",
 *     duration: 6000,
 *     action: { label: "View", onClick: () => router.push("/photos") },
 *   });
 */

import { useCallback } from "react";
import { create } from "zustand";

// ─── Toast Types ───────────────────────────────────────────────────────────────

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  duration: number;         // ms before auto-dismiss (0 = persist until dismissed)
  action?: ToastAction;
  isExiting?: boolean;      // true when the exit animation is running
  createdAt: number;        // timestamp for ordering
}

export type ToastInput = Omit<Toast, "id" | "createdAt" | "isExiting">;

// ─── Default durations per variant ────────────────────────────────────────────

const DEFAULT_DURATIONS: Record<ToastVariant, number> = {
  success: 4000,
  error: 6000,    // Errors stay longer so users can read them
  warning: 5000,
  info: 4000,
};

const MAX_TOASTS = 5; // Max visible toasts at once

// ─── Toast Store (Zustand) ────────────────────────────────────────────────────

interface ToastStore {
  toasts: Toast[];
  add: (toast: ToastInput) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  markExiting: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  // ── Add a new toast ──────────────────────────────────────────────────────
  add: (input: ToastInput): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const newToast: Toast = {
      ...input,
      id,
      createdAt: Date.now(),
      isExiting: false,
    };

    set((state) => {
      // Cap at MAX_TOASTS — remove oldest if over limit
      const currentToasts = state.toasts;
      const trimmed =
        currentToasts.length >= MAX_TOASTS
          ? currentToasts.slice(currentToasts.length - MAX_TOASTS + 1)
          : currentToasts;

      return { toasts: [...trimmed, newToast] };
    });

    // Auto-dismiss after duration (if duration > 0)
    if (input.duration > 0) {
      setTimeout(() => {
        get().markExiting(id);

        // Wait for exit animation before removing from DOM
        setTimeout(() => {
          get().dismiss(id);
        }, 300); // Match CSS animation duration
      }, input.duration);
    }

    return id;
  },

  // ── Mark as exiting (triggers CSS exit animation) ─────────────────────────
  markExiting: (id: string) => {
    set((state) => ({
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, isExiting: true } : t
      ),
    }));
  },

  // ── Remove a toast by ID ──────────────────────────────────────────────────
  dismiss: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // ── Remove all toasts ─────────────────────────────────────────────────────
  dismissAll: () => {
    set({ toasts: [] });
  },
}));

// ─── useToast Hook ─────────────────────────────────────────────────────────────

interface ToastHelpers {
  /**
   * Show a success toast.
   * @example toast.success("Photo uploaded successfully!")
   */
  success: (title: string, description?: string, duration?: number) => string;

  /**
   * Show an error toast.
   * @example toast.error("Failed to upload photo.")
   */
  error: (title: string, description?: string, duration?: number) => string;

  /**
   * Show a warning toast.
   * @example toast.warning("File size is near the limit.")
   */
  warning: (title: string, description?: string, duration?: number) => string;

  /**
   * Show an info toast.
   * @example toast.info("Syncing changes...")
   */
  info: (title: string, description?: string, duration?: number) => string;

  /**
   * Show a fully customized toast.
   * @example
   * toast.custom({
   *   variant: "success",
   *   title: "Upload complete",
   *   description: "3 photos uploaded.",
   *   duration: 6000,
   *   action: { label: "View", onClick: () => router.push("/photos") },
   * })
   */
  custom: (input: ToastInput) => string;

  /**
   * Dismiss a specific toast by ID.
   * @example const id = toast.success("..."); toast.dismiss(id);
   */
  dismiss: (id: string) => void;

  /**
   * Dismiss all active toasts.
   */
  dismissAll: () => void;
}

interface UseToastReturn {
  toast: ToastHelpers;
  toasts: Toast[];
}

export const useToast = (): UseToastReturn => {
  const { add, dismiss, dismissAll, toasts } = useToastStore();

  const success = useCallback(
    (title: string, description?: string, duration?: number): string => {
      return add({
        variant: "success",
        title,
        description,
        duration: duration ?? DEFAULT_DURATIONS.success,
      });
    },
    [add]
  );

  const error = useCallback(
    (title: string, description?: string, duration?: number): string => {
      return add({
        variant: "error",
        title,
        description,
        duration: duration ?? DEFAULT_DURATIONS.error,
      });
    },
    [add]
  );

  const warning = useCallback(
    (title: string, description?: string, duration?: number): string => {
      return add({
        variant: "warning",
        title,
        description,
        duration: duration ?? DEFAULT_DURATIONS.warning,
      });
    },
    [add]
  );

  const info = useCallback(
    (title: string, description?: string, duration?: number): string => {
      return add({
        variant: "info",
        title,
        description,
        duration: duration ?? DEFAULT_DURATIONS.info,
      });
    },
    [add]
  );

  const custom = useCallback(
    (input: ToastInput): string => {
      return add(input);
    },
    [add]
  );

  const dismissById = useCallback(
    (id: string): void => {
      dismiss(id);
    },
    [dismiss]
  );

  const dismissAllToasts = useCallback((): void => {
    dismissAll();
  }, [dismissAll]);

  return {
    toast: {
      success,
      error,
      warning,
      info,
      custom,
      dismiss: dismissById,
      dismissAll: dismissAllToasts,
    },
    toasts,
  };
};