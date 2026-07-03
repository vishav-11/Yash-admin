/**
 * LoadingScreen Component
 *
 * Full-screen loading state shown while:
 * - Auth state is being hydrated from localStorage
 * - Admin is being redirected after login/logout
 * - Initial app bootstrap is happening
 *
 * Three variants:
 * - "screen"  → full viewport height (default, for auth guard)
 * - "page"    → fills parent container (for page-level loading)
 * - "inline"  → small inline spinner (for section loading)
 */

import React from "react";
import { cn } from "@/utils/cn.utils";

type LoadingVariant = "screen" | "page" | "inline";
type LoadingSize = "sm" | "md" | "lg";

interface LoadingScreenProps {
  variant?: LoadingVariant;
  size?: LoadingSize;
  message?: string;
  className?: string;
}

// ─── Spinner sizes ─────────────────────────────────────────────────────────────

const SPINNER_SIZES: Record<LoadingSize, { outer: number; inner: number }> = {
  sm: { outer: 24, inner: 20 },
  md: { outer: 40, inner: 34 },
  lg: { outer: 56, inner: 48 },
};

// ─── Animated Logo Spinner ─────────────────────────────────────────────────────

const LogoSpinner: React.FC<{ size: LoadingSize }> = ({ size }) => {
  const { outer } = SPINNER_SIZES[size];

  return (
    <div className="relative" style={{ width: outer, height: outer }}>
      {/* Spinning ring */}
      <svg
        width={outer}
        height={outer}
        viewBox="0 0 40 40"
        fill="none"
        className="animate-spin"
        style={{ animationDuration: "1s" }}
        aria-hidden="true"
      >
        {/* Background track */}
        <circle
          cx="20"
          cy="20"
          r="17"
          stroke="currentColor"
          strokeWidth="3"
          className="text-slate-200"
        />
        {/* Spinning arc */}
        <circle
          cx="20"
          cy="20"
          r="17"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="60 47"
          className="text-blue-500"
        />
      </svg>

      {/* Center logo mark */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className={cn(
            "flex items-center justify-center rounded-lg",
            "bg-linear-to-br from-blue-500 to-indigo-600",
            size === "sm" && "h-4 w-4",
            size === "md" && "h-6 w-6",
            size === "lg" && "h-8 w-8"
          )}
        >
          <svg
            width={size === "sm" ? 8 : size === "md" ? 12 : 16}
            height={size === "sm" ? 8 : size === "md" ? 12 : 16}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
      </div>
    </div>
  );
};

// ─── Dot Pulse Loader ──────────────────────────────────────────────────────────

const DotPulse: React.FC = () => (
  <div className="flex items-center gap-1.5" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="h-1.5 w-1.5 rounded-full bg-blue-400"
        style={{
          animation: "pulse 1.2s ease-in-out infinite",
          animationDelay: `${i * 0.2}s`,
        }}
      />
    ))}
  </div>
);

// ─── Screen Variant — Full Viewport ───────────────────────────────────────────

const ScreenLoader: React.FC<{ message?: string }> = ({ message }) => (
  <div
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50"
    role="status"
    aria-label={message ?? "Loading, please wait"}
    aria-live="polite"
  >
    {/* Background decoration */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-32 -top-32 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />
    </div>

    <div className="relative flex flex-col items-center gap-6">
      {/* Large spinner */}
      <LogoSpinner size="lg" />

      {/* App name */}
      <div className="flex flex-col items-center gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">
          Portfolio
        </p>
        <p className="text-lg font-bold text-slate-700">Admin Panel</p>
      </div>

      {/* Message */}
      {message && (
        <p className="text-sm text-slate-400 text-center max-w-xs">
          {message}
        </p>
      )}

      {/* Dot pulse */}
      <DotPulse />
    </div>
  </div>
);

// ─── Page Variant — Fills Parent Container ─────────────────────────────────────

const PageLoader: React.FC<{ message?: string }> = ({ message }) => (
  <div
    className="flex min-h-96 flex-col items-center justify-center gap-5 p-8"
    role="status"
    aria-label={message ?? "Loading content"}
    aria-live="polite"
  >
    <LogoSpinner size="md" />

    <div className="flex flex-col items-center gap-1.5">
      {message && (
        <p className="text-sm font-medium text-slate-600">{message}</p>
      )}
      <DotPulse />
    </div>
  </div>
);

// ─── Inline Variant — Small Spinner ───────────────────────────────────────────

const InlineLoader: React.FC<{ message?: string }> = ({ message }) => (
  <div
    className="flex items-center gap-3"
    role="status"
    aria-label={message ?? "Loading"}
    aria-live="polite"
  >
    <LogoSpinner size="sm" />
    {message && (
      <p className="text-sm text-slate-500">{message}</p>
    )}
  </div>
);

// ─── Main Export ───────────────────────────────────────────────────────────────

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  variant = "screen",
  size = "md",
  message,
  className,
}) => {
  return (
    <div className={className}>
      {variant === "screen" && <ScreenLoader message={message} />}
      {variant === "page" && <PageLoader message={message} />}
      {variant === "inline" && <InlineLoader message={message} />}
    </div>
  );
};

export default LoadingScreen;