"use client";

import React from "react";
import { cn } from "@/utils/cn.utils";
import type { RecentActivity } from "../types/dashboard.types";

// ─── Relative Time ─────────────────────────────────────────────────────────────

const getRelativeTime = (timestamp: string): string => {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// ─── Activity Icon ─────────────────────────────────────────────────────────────

const ActivityIcon: React.FC<{
  type: RecentActivity["type"];
  action: RecentActivity["action"];
}> = ({ type, action }) => {
  const typeColors = {
    photo: "bg-blue-100 text-blue-600",
    video: "bg-violet-100 text-violet-600",
    logo: "bg-emerald-100 text-emerald-600",
  };

  const actionColors = {
    uploaded: "bg-green-100 text-green-600",
    updated: "bg-amber-100 text-amber-600",
    deleted: "bg-red-100 text-red-500",
  };

  const typeIcons = {
    photo: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
    video: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m22 8-6 4 6 4V8z" />
        <rect width="14" height="12" x="2" y="6" rx="2" />
      </svg>
    ),
    logo: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
        <path d="M7 7h.01" />
      </svg>
    ),
  };

  const actionIcons = {
    uploaded: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
    ),
    updated: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    deleted: (
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  };

  return (
    <div className="relative">
      {/* Main type icon */}
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", typeColors[type])}>
        {typeIcons[type]}
      </div>
      {/* Action badge */}
      <div className={cn("absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full ring-2 ring-white", actionColors[action])}>
        {actionIcons[action]}
      </div>
    </div>
  );
};

// ─── Skeleton ──────────────────────────────────────────────────────────────────

export const RecentActivitySkeleton: React.FC = () => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6">
    <div className="mb-5 flex items-center justify-between">
      <div className="h-5 w-36 rounded bg-slate-100" />
      <div className="h-4 w-16 rounded bg-slate-100" />
    </div>
    <div className="flex flex-col gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 animate-pulse">
          <div className="h-9 w-9 rounded-xl bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-3/4 rounded bg-slate-100" />
            <div className="h-3 w-1/2 rounded bg-slate-100" />
          </div>
          <div className="h-3 w-12 rounded bg-slate-100 shrink-0" />
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────────────────────

interface RecentActivityProps {
  activities: RecentActivity[];
}

const RecentActivityCard: React.FC<RecentActivityProps> = ({ activities }) => {
  const actionLabels = {
    uploaded: "Uploaded",
    updated: "Updated",
    deleted: "Deleted",
  };

  const actionColors = {
    uploaded: "text-green-600",
    updated: "text-amber-600",
    deleted: "text-red-500",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-50 px-6 py-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Recent Activity
          </h3>
          <p className="mt-0.5 text-xs text-slate-400">
            Latest changes across all media
          </p>
        </div>
        <div className="flex h-7 items-center rounded-lg bg-slate-50 px-2.5">
          <span className="text-xs font-medium text-slate-500">
            {activities.length} events
          </span>
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-slate-50">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <p className="text-sm text-slate-400">No recent activity</p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity.id}
              className={cn(
                "flex items-center gap-4 px-6 py-4",
                "transition-colors duration-150 hover:bg-slate-50/80"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Icon */}
              <ActivityIcon type={activity.type} action={activity.action} />

              {/* Content */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">
                  {activity.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-400">
                  <span className={cn("font-medium", actionColors[activity.action])}>
                    {actionLabels[activity.action]}
                  </span>
                  {" · "}
                  <span className="capitalize">{activity.type}</span>
                </p>
              </div>

              {/* Timestamp */}
              <time
                dateTime={activity.timestamp}
                className="shrink-0 text-xs text-slate-400"
                title={new Date(activity.timestamp).toLocaleString()}
              >
                {getRelativeTime(activity.timestamp)}
              </time>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {activities.length > 0 && (
        <div className="border-t border-slate-50 px-6 py-3">
          <p className="text-center text-xs text-slate-400">
            Showing last {activities.length} activities
          </p>
        </div>
      )}
    </div>
  );
};

export default RecentActivityCard;