"use client";

import React from "react";
import { cn } from "@/utils/cn.utils";
import type { DashboardStat, StatColor, StatIconName } from "../types/dashboard.types";

// ─── Color Configs ─────────────────────────────────────────────────────────────

const COLOR_CONFIGS: Record<
  StatColor,
  {
    card: string;
    iconWrapper: string;
    icon: string;
    badge: string;
    value: string;
  }
> = {
  blue: {
    card: "border-blue-100 bg-gradient-to-br from-blue-50 to-white",
    iconWrapper: "bg-blue-100",
    icon: "text-blue-600",
    badge: "bg-blue-600",
    value: "text-blue-700",
  },
  violet: {
    card: "border-violet-100 bg-gradient-to-br from-violet-50 to-white",
    iconWrapper: "bg-violet-100",
    icon: "text-violet-600",
    badge: "bg-violet-600",
    value: "text-violet-700",
  },
  emerald: {
    card: "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white",
    iconWrapper: "bg-emerald-100",
    icon: "text-emerald-600",
    badge: "bg-emerald-600",
    value: "text-emerald-700",
  },
  amber: {
    card: "border-amber-100 bg-gradient-to-br from-amber-50 to-white",
    iconWrapper: "bg-amber-100",
    icon: "text-amber-600",
    badge: "bg-amber-600",
    value: "text-amber-700",
  },
};

// ─── Stat Icons ────────────────────────────────────────────────────────────────

const StatIcon: React.FC<{ name: StatIconName; className?: string }> = ({
  name,
  className,
}) => {
  const icons: Record<StatIconName, React.ReactNode> = {
    photos: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
    videos: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="m22 8-6 4 6 4V8z" />
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
      </svg>
    ),
    logos: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
        <path d="M7 7h.01" />
      </svg>
    ),
    total: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <rect width="7" height="7" x="3" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="3" rx="1" />
        <rect width="7" height="7" x="14" y="14" rx="1" />
        <rect width="7" height="7" x="3" y="14" rx="1" />
      </svg>
    ),
  };

  return <>{icons[name]}</>;
};

// ─── Skeleton Loader ───────────────────────────────────────────────────────────

export const StatCardSkeleton: React.FC = () => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="h-11 w-11 rounded-xl bg-slate-100" />
      <div className="h-5 w-16 rounded-full bg-slate-100" />
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-8 w-24 rounded-lg bg-slate-100" />
      <div className="h-4 w-32 rounded bg-slate-100" />
    </div>
    <div className="mt-4 h-3 w-28 rounded bg-slate-100" />
  </div>
);

// ─── Main StatCard Component ───────────────────────────────────────────────────

interface StatCardProps {
  stat: DashboardStat;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index }) => {
  const colors = COLOR_CONFIGS[stat.color];
  const isPositive = stat.change >= 0;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border p-6",
        "transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-0.5",
        colors.card
      )}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Decorative circle */}
      <div
        className={cn(
          "pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-10",
          colors.badge
        )}
      />

      {/* Top row: Icon + Change badge */}
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", colors.iconWrapper)}>
          <StatIcon name={stat.icon} className={colors.icon} />
        </div>

        {/* Change badge */}
        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
            isPositive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          )}
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(isPositive ? "text-green-600" : "rotate-180 text-red-500")}
            aria-hidden="true"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
          {Math.abs(stat.change)}%
        </div>
      </div>

      {/* Value */}
      <div className="mt-4">
        <p className={cn("text-3xl font-bold tracking-tight", colors.value)}>
          {stat.value.toLocaleString()}
          {stat.suffix && (
            <span className="ml-1 text-lg font-medium opacity-70">
              {stat.suffix}
            </span>
          )}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-500">{stat.label}</p>
      </div>

      {/* Footer */}
      <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
        <span
          className={cn(
            "inline-block h-1.5 w-1.5 rounded-full",
            isPositive ? "bg-green-500" : "bg-red-400"
          )}
        />
        {isPositive ? "+" : ""}{stat.change}% {stat.changeLabel}
      </p>
    </div>
  );
};

export default StatCard;