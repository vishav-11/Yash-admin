"use client";

/**
 * Topbar Component
 *
 * Features:
 * - Mobile hamburger menu toggle
 * - Current page title (from pathname)
 * - Breadcrumb navigation
 * -     avatar dropdown
 * - Notification bell (ready for future use)
 * - Fully responsive
 */

import React, { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/utils/cn.utils";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { ROUTES } from "@/constants/routes.constants";

// ─── Breadcrumb ────────────────────────────────────────────────────────────────

interface BreadcrumbSegment {
  label: string;
  href: string;
}

const buildBreadcrumbs = (pathname: string): BreadcrumbSegment[] => {
  const segments = pathname.split("/").filter(Boolean);

  // Label map for clean display names
  const labelMap: Record<string, string> = {
    dashboard: "Dashboard",
    photos: "Photos",
    videos: "Videos",
    logos: "Logos",
    upload: "Upload",
    edit: "Edit",
    settings: "Settings",
  };

  return segments.map((segment, index) => ({
    label: labelMap[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1),
    href: "/" + segments.slice(0, index + 1).join("/"),
  }));
};

const Breadcrumb: React.FC = () => {
  const pathname = usePathname();
  const crumbs = buildBreadcrumbs(pathname);

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <React.Fragment key={crumb.href}>
            {index > 0 && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-300 shrink-0"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            )}

            {isLast ? (
              <span className="text-sm font-medium text-slate-700 truncate max-w-32">
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="text-sm text-slate-400 hover:text-slate-600 transition-colors duration-150 truncate max-w-32"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

// ─── Page Title ────────────────────────────────────────────────────────────────

const PageTitle: React.FC = () => {
  const pathname = usePathname();

  const titleMap: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/photos": "Photos",
    "/photos/upload": "Upload Photo",
    "/videos": "Videos",
    "/videos/upload": "Upload Video",
    "/logos": "Logos",
    "/logos/upload": "Upload Logo",
  };

  // Check for dynamic routes like /photos/123
  let title = titleMap[pathname];
  if (!title) {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length >= 2) {
      const base = `/${segments[0]}`;
      title = `${titleMap[base] ?? segments[0]} — Detail`;
    } else {
      title = segments[0]
        ? segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
        : "Dashboard";
    }
  }

  return (
    <h1 className="text-base font-semibold text-slate-800 sm:hidden">
      {title}
    </h1>
  );
};

// ─── Notification Bell ─────────────────────────────────────────────────────────

const NotificationBell: React.FC = () => {
  const hasNotifications = false; // Wire up to real data later

  return (
    <button
      aria-label={hasNotifications ? "View notifications" : "No new notifications"}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-lg",
        "text-slate-500 transition-colors duration-150",
        "hover:bg-slate-100 hover:text-slate-700",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      )}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>

      {/* Unread dot */}
      {hasNotifications && (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
      )}
    </button>
  );
};

// ─── Admin Dropdown Menu ────────────────────────────────────────────────────────


const UserDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { admin } = useAuthStore();      // ← user → admin
  const { logout } = useLogout();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const initials = admin?.name
    ? admin.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="User menu"
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors duration-150 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {/* Avatar */}
        <div className="relative">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-xs font-bold text-white shadow-sm">
            {initials}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
        </div>

        {/* Name + Role — desktop */}
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-slate-700 leading-tight">
            {admin?.name ?? "Admin"}
          </p>
          <p className="text-xs text-slate-400 leading-tight">
            Administrator
          </p>
        </div>

        {/* Chevron */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "hidden md:block shrink-0 text-slate-400",
            "transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-slate-200 bg-white py-1 shadow-lg shadow-black/10"
        >
          {/* Header */}
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {admin?.name ?? "Admin"}
            </p>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {admin?.email ?? "admin@example.com"}
            </p>
            <span className="mt-1.5 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-600">
              Administrator
            </span>
          </div>

          {/* Dashboard link */}
          <div className="py-1">
            <Link
              href={ROUTES.DASHBOARD.ROOT}
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-slate-600 transition-colors duration-150 hover:bg-slate-50 hover:text-slate-900"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              Dashboard
            </Link>
          </div>

          <div className="my-1 h-px bg-slate-100" />

          {/* Logout */}
          <div className="py-1">
            <button
              role="menuitem"
              onClick={() => { setIsOpen(false); logout(); }}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-500 transition-colors duration-150 hover:bg-red-50 hover:text-red-600"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Topbar Component ─────────────────────────────────────────────────────

export const Topbar: React.FC = () => {
  const { toggleSidebar } = useUIStore();

  return (
    <header className="flex h-16 shrink-0 items-center gap-4 border-b border-slate-200 bg-white px-4 md:px-6">
      {/* ── Left: Hamburger + Title/Breadcrumb ───────────────────────────────── */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          aria-label="Toggle navigation menu"
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg lg:hidden",
            "text-slate-500 transition-colors duration-150",
            "hover:bg-slate-100 hover:text-slate-700",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          )}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>

        {/* Mobile: page title | Desktop: breadcrumb */}
        <PageTitle />
        <Breadcrumb />
      </div>

      {/* ── Right: Actions ───────────────────────────────────────────────────── */}
      <div className="flex shrink-0 items-center gap-1">
        <NotificationBell />

        {/* Divider */}
        <div className="mx-1 h-6 w-px bg-slate-200" aria-hidden="true" />

        <UserDropdown />
      </div>
    </header>
  );
};

export default Topbar;