"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/utils/cn.utils";
import {
  useToastStore,
  type Toast,
  type ToastVariant,
} from "@/hooks/useToast";

// ─── Variant configs ───────────────────────────────────────────────────────────

const VARIANT_ICONS: Record<ToastVariant, React.ReactNode> = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const VARIANT_STYLES: Record<ToastVariant, { wrapper: string; icon: string; progress: string }> = {
  success: {
    wrapper: "border-green-200 bg-green-50",
    icon: "bg-green-100 text-green-600",
    progress: "bg-green-500",
  },
  error: {
    wrapper: "border-red-200 bg-red-50",
    icon: "bg-red-100 text-red-600",
    progress: "bg-red-500",
  },
  warning: {
    wrapper: "border-amber-200 bg-amber-50",
    icon: "bg-amber-100 text-amber-600",
    progress: "bg-amber-500",
  },
  info: {
    wrapper: "border-blue-200 bg-blue-50",
    icon: "bg-blue-100 text-blue-600",
    progress: "bg-blue-500",
  },
};

// ─── Progress Bar ──────────────────────────────────────────────────────────────

const ToastProgressBar = ({
  duration,
  variant,
}: {
  duration: number;
  variant: ToastVariant;
}) => {
  if (duration === 0) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b-xl bg-black/5">
      <div
        className={cn("h-full origin-left", VARIANT_STYLES[variant].progress)}
        style={{
          animation: `toast-progress ${duration}ms linear forwards`,
        }}
      />
    </div>
  );
};

// ─── Single Toast Item ─────────────────────────────────────────────────────────

const ToastItem = ({ toast }: { toast: Toast }) => {
  const { markExiting, dismiss } = useToastStore();
  const styles = VARIANT_STYLES[toast.variant];

  const handleDismiss = () => {
    markExiting(toast.id);
    setTimeout(() => dismiss(toast.id), 300);
  };

  return (
    <div
      role="alert"
      aria-live={toast.variant === "error" ? "assertive" : "polite"}
      aria-atomic="true"
      className={cn(
        "relative flex w-full max-w-sm items-start gap-3 overflow-hidden",
        "rounded-xl border p-4 shadow-lg shadow-black/5",
        "transition-all duration-300 ease-out",
        styles.wrapper,
        !toast.isExiting && "translate-x-0 opacity-100",
        toast.isExiting && "translate-x-full opacity-0"
      )}
    >
      <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full", styles.icon)}>
        {VARIANT_ICONS[toast.variant]}
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-sm text-slate-500">{toast.description}</p>
        )}
        {toast.action && (
          <button
            onClick={() => { toast.action?.onClick(); handleDismiss(); }}
            className={cn(
              "mt-2 text-xs font-semibold underline-offset-2 transition-opacity hover:opacity-70",
              toast.variant === "success" && "text-green-700",
              toast.variant === "error" && "text-red-700",
              toast.variant === "warning" && "text-amber-700",
              toast.variant === "info" && "text-blue-700"
            )}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      <button
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 rounded-lg p-1 text-slate-400 transition-colors duration-150 hover:bg-black/5 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400/30"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <ToastProgressBar duration={toast.duration} variant={toast.variant} />
    </div>
  );
};

// ─── Main Toast Container ──────────────────────────────────────────────────────

const ToastContainer = () => {
  const { toasts } = useToastStore();

  /**
   * KEY FIX: isMounted state
   *
   * Why: ToastContainer SSR pe render hota hai as empty.
   * Client pe Zustand store se toasts aate hain.
   * Agar directly render karein toh SSR/CSR mismatch hoga.
   *
   * Solution: Sirf client pe mount hone ke baad render karo.
   */
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Server pe aur first client render pe kuch nahi dikhao
  if (!isMounted) return null;

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes toast-progress {
          from { transform: scaleX(1); }
          to   { transform: scaleX(0); }
        }
      `}</style>

      <div
        aria-label="Notifications"
        className={cn(
          "fixed z-9999 flex flex-col gap-2",
          "top-4 left-4 right-4",
          "sm:left-auto sm:right-4 sm:top-4 sm:w-95"
        )}
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </div>
    </>
  );
};

export default ToastContainer;