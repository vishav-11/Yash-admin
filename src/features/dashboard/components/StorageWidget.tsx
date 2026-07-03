"use client";

import React from "react";
import { cn } from "@/utils/cn.utils";

interface StorageWidgetProps {
  total: number;    // MB
  used: number;     // MB
}

const formatStorage = (mb: number): string => {
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  return `${mb} MB`;
};

export const StorageWidgetSkeleton: React.FC = () => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 animate-pulse">
    <div className="mb-4 h-5 w-32 rounded bg-slate-100" />
    <div className="mb-3 h-3 w-full rounded-full bg-slate-100" />
    <div className="flex justify-between">
      <div className="h-3 w-20 rounded bg-slate-100" />
      <div className="h-3 w-16 rounded bg-slate-100" />
    </div>
  </div>
);

const StorageWidget: React.FC<StorageWidgetProps> = ({ total, used }) => {
  const percentage = Math.min(Math.round((used / total) * 100), 100);

  const getBarColor = () => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 75) return "bg-amber-500";
    return "bg-blue-500";
  };

  const getStatusText = () => {
    if (percentage >= 90) return { text: "Critical", color: "text-red-500 bg-red-50" };
    if (percentage >= 75) return { text: "High Usage", color: "text-amber-600 bg-amber-50" };
    return { text: "Healthy", color: "text-green-600 bg-green-50" };
  };

  const status = getStatusText();

  // Circular progress values
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Storage</h3>
          <p className="mt-0.5 text-xs text-slate-400">Media storage usage</p>
        </div>
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", status.color)}>
          {status.text}
        </span>
      </div>

      {/* Circular Progress + Stats */}
      <div className="flex items-center gap-6">
        {/* Circular progress */}
        <div className="relative shrink-0">
          <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90" aria-hidden="true">
            {/* Track */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="8"
            />
            {/* Progress */}
            <circle
              cx="48"
              cy="48"
              r={radius}
              fill="none"
              stroke={
                percentage >= 90
                  ? "#ef4444"
                  : percentage >= 75
                  ? "#f59e0b"
                  : "#3b82f6"
              }
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-700">{percentage}%</span>
            <span className="text-[10px] text-slate-400">used</span>
          </div>
        </div>

        {/* Storage details */}
        <div className="flex-1 space-y-3">
          {/* Used */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">Used</span>
              <span className="text-xs font-semibold text-slate-700">
                {formatStorage(used)}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn("h-full rounded-full transition-all duration-1000", getBarColor())}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Free */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">Free</span>
              <span className="text-xs font-semibold text-slate-700">
                {formatStorage(total - used)}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-200 transition-all duration-1000"
                style={{ width: `${100 - percentage}%` }}
              />
            </div>
          </div>

          {/* Total */}
          <div className="rounded-lg bg-slate-50 px-3 py-2 text-center">
            <p className="text-xs text-slate-400">Total capacity</p>
            <p className="text-sm font-bold text-slate-700">{formatStorage(total)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageWidget;