"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn.utils";
import { ROUTES } from "@/constants/routes.constants";

interface QuickAction {
  label: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  iconBg: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Upload Photo",
    description: "Add new photos",
    href: ROUTES.PHOTOS.UPLOAD,
    iconBg: "bg-blue-100",
    color: "text-blue-600",
    hoverColor: "hover:border-blue-200 hover:bg-blue-50/50",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    ),
  },
  {
    label: "Upload Video",
    description: "Add new videos",
    href: ROUTES.VIDEOS.UPLOAD,
    iconBg: "bg-violet-100",
    color: "text-violet-600",
    hoverColor: "hover:border-violet-200 hover:bg-violet-50/50",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m22 8-6 4 6 4V8z" />
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    label: "Upload Logo",
    description: "Add new logos",
    href: ROUTES.LOGOS.UPLOAD,
    iconBg: "bg-emerald-100",
    color: "text-emerald-600",
    hoverColor: "hover:border-emerald-200 hover:bg-emerald-50/50",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
        <path d="M7 7h.01" />
      </svg>
    ),
  },
  {
    label: "View Photos",
    description: "Browse all photos",
    href: ROUTES.PHOTOS.ROOT,
    iconBg: "bg-slate-100",
    color: "text-slate-600",
    hoverColor: "hover:border-slate-200 hover:bg-slate-50/50",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

const QuickActions: React.FC = () => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6">
    {/* Header */}
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-slate-800">Quick Actions</h3>
      <p className="mt-0.5 text-xs text-slate-400">Common tasks at a glance</p>
    </div>

    {/* Actions Grid */}
    <div className="grid grid-cols-2 gap-3">
      {QUICK_ACTIONS.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className={cn(
            "group flex flex-col gap-3 rounded-xl border border-slate-100 p-4",
            "transition-all duration-200",
            "hover:shadow-sm hover:-translate-y-0.5",
            action.hoverColor
          )}
        >
          {/* Icon */}
          <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg", action.iconBg)}>
            <span className={action.color}>{action.icon}</span>
          </div>

          {/* Text */}
          <div>
            <p className="text-sm font-semibold text-slate-700 leading-tight">
              {action.label}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">{action.description}</p>
          </div>

          {/* Arrow */}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              "mt-auto self-end transition-transform duration-200",
              "text-slate-300 group-hover:translate-x-0.5",
              action.color.replace("text-", "group-hover:text-")
            )}
            aria-hidden="true"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
      ))}
    </div>
  </div>
);

export default QuickActions;