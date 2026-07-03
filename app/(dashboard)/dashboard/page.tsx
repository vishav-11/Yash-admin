"use client";

import React from "react";
import { useAuthStore } from "@/stores/auth.store";
import { useDashboard } from "@/features/dashboard/hooks/useDashboard";
import StatCard, { StatCardSkeleton } from "@/features/dashboard/components/StatCard";
import RecentActivityCard, { RecentActivitySkeleton } from "@/features/dashboard/components/RecentActivity";
import StorageWidget, { StorageWidgetSkeleton } from "@/features/dashboard/components/StorageWidget";
import QuickActions from "@/features/dashboard/components/QuickActions";
import { cn } from "@/utils/cn.utils";

// ─── Page Header ───────────────────────────────────────────────────────────────

const DashboardHeader: React.FC<{ adminName: string }> = ({ adminName }) => {
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
          {getGreeting()},{" "}
          <span className="text-blue-600">
            {adminName.split(" ")[0]}
          </span>{" "}
          👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">{today}</p>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-2 self-start rounded-full border border-green-200 bg-green-50 px-3 py-1.5 sm:self-auto">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
        </span>
        <span className="text-xs font-medium text-green-700">System Online</span>
      </div>
    </div>
  );
};

// ─── Error State ───────────────────────────────────────────────────────────────

const DashboardError: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-16 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-red-500" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <h3 className="mt-4 text-base font-semibold text-slate-700">
      Failed to load dashboard
    </h3>
    <p className="mt-1.5 text-sm text-slate-400">
      Something went wrong while fetching your data.
    </p>
    <button
      onClick={onRetry}
      className={cn(
        "mt-5 flex items-center gap-2 rounded-lg bg-white px-4 py-2",
        "border border-red-200 text-sm font-medium text-red-600",
        "transition-colors duration-150 hover:bg-red-50",
        "focus:outline-none focus:ring-2 focus:ring-red-500/30"
      )}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M8 16H3v5" />
      </svg>
      Try again
    </button>
  </div>
);

// ─── Main Dashboard Page ───────────────────────────────────────────────────────

export default function DashboardPage() {
  const { admin } = useAuthStore();
  const {
    stats,
    recentActivity,
    totalStorage,
    usedStorage,
    isLoading,
    isError,
    refetch,
  } = useDashboard();

  return (
    <div className="flex flex-col gap-6">

      {/* ── Page Header ──────────────────────────────────────────────────────── */}
      <DashboardHeader adminName={admin?.name ?? "Admin"} />

      {/* ── Error State ──────────────────────────────────────────────────────── */}
      {isError && <DashboardError onRetry={refetch} />}

      {/* ── Stats Grid ───────────────────────────────────────────────────────── */}
      <section aria-label="Statistics overview">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <StatCardSkeleton key={i} />
              ))
            : stats.map((stat, index) => (
                <StatCard key={stat.id} stat={stat} index={index} />
              ))}
        </div>
      </section>

      {/* ── Main Content Grid ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Recent Activity — takes 2 cols on large screens */}
        <section
          className="lg:col-span-2"
          aria-label="Recent activity"
        >
          {isLoading ? (
            <RecentActivitySkeleton />
          ) : (
            <RecentActivityCard activities={recentActivity} />
          )}
        </section>

        {/* Right column: Quick Actions + Storage */}
        <div className="flex flex-col gap-6">
          {/* Quick Actions */}
          <section aria-label="Quick actions">
            <QuickActions />
          </section>

          {/* Storage Widget */}
          <section aria-label="Storage usage">
            {isLoading ? (
              <StorageWidgetSkeleton />
            ) : (
              <StorageWidget
                total={totalStorage}
                used={usedStorage}
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}