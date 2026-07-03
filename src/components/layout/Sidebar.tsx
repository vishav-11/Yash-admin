"use client";

/**
 * Sidebar Component
 *
 * Fully responsive sidebar with:
 * - Collapsible (icon-only) mode on desktop
 * - Mobile drawer (slides in from left)
 * - Active route highlighting
 * - Smooth animations
 * - Group labels for nav sections
 * - Admin profile section at bottom
 * - Keyboard accessible
 */

import React, { useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn.utils";
import { useUIStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { NAVIGATION } from "@/constants/navigation.constants";
import NavIcon from "./NavIcon";
import type { NavItem } from "@/constants/navigation.constants";

// ─── Brand Logo Mark ───────────────────────────────────────────────────────────

const SidebarBrand: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => (
  <div
    className={cn(
      "flex items-center h-16 px-4 border-b border-slate-800 shrink-0",
      "transition-all duration-300",
      isCollapsed ? "justify-center px-2" : "gap-3"
    )}
  >
    {/* Logo icon — always visible */}
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    </div>

    {/* App name — hidden when collapsed */}
    {!isCollapsed && (
      <div className="min-w-0 overflow-hidden">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400 leading-none">
          Portfolio
        </p>
        <p className="text-sm font-bold text-white leading-tight truncate">
          Admin Panel
        </p>
      </div>
    )}
  </div>
);

// ─── Single Nav Link Item ──────────────────────────────────────────────────────

interface NavLinkProps {
  item: NavItem;
  isCollapsed: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ item, isCollapsed, onClick }) => {
  const pathname = usePathname();

  // Exact match for dashboard, prefix match for everything else
  const isActive =
    item.href === "/dashboard"
      ? pathname === item.href
      : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      title={isCollapsed ? item.label : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        // Base
        "group relative flex items-center rounded-lg",
        "text-sm font-medium transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        // Collapsed vs expanded layout
        isCollapsed
          ? "h-10 w-10 justify-center mx-auto"
          : "h-10 gap-3 px-3 w-full",
        // Active state
        isActive
          ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
          : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"
      )}
    >
      {/* Active indicator bar */}
      {isActive && !isCollapsed && (
        <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-white/60" />
      )}

      {/* Icon */}
      <NavIcon
        name={item.icon}
        size={18}
        className={cn(
          "shrink-0 transition-transform duration-200",
          "group-hover:scale-110",
          isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
        )}
      />

      {/* Label — hidden when collapsed */}
      {!isCollapsed && (
        <span className="truncate">{item.label}</span>
      )}

      {/* Badge — hidden when collapsed */}
      {!isCollapsed && item.badge !== undefined && item.badge > 0 && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-bold text-white">
          {item.badge > 99 ? "99+" : item.badge}
        </span>
      )}

      {/* Tooltip for collapsed mode */}
      {isCollapsed && (
        <span
          className={cn(
            "pointer-events-none absolute left-full ml-3 z-50",
            "whitespace-nowrap rounded-lg bg-slate-800 px-3 py-1.5",
            "text-xs font-medium text-slate-100 shadow-xl",
            "opacity-0 translate-x-0 scale-95",
            "transition-all duration-150",
            "group-hover:opacity-100 group-hover:translate-x-0 group-hover:scale-100",
            // Arrow
            "before:absolute before:-left-1.5 before:top-1/2 before:-translate-y-1/2",
            "before:h-2.5 before:w-2.5 before:rotate-45 before:bg-slate-800"
          )}
          role="tooltip"
        >
          {item.label}
        </span>
      )}
    </Link>
  );
};

// ─── Admin Profile Section ──────────────────────────────────────────────────────


const SidebarUserProfile: React.FC<{ isCollapsed: boolean }> = ({
  isCollapsed,
}) => {
  const { admin } = useAuthStore();     // ← user → admin
  const { logout } = useLogout();

  const initials = admin?.name
    ? admin.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <div className="shrink-0 border-t border-slate-800">
      <div
        className={cn(
          "flex items-center gap-3 p-4",
          isCollapsed && "justify-center p-3"
        )}
      >
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-500 text-xs font-bold text-white shadow-md">
            {initials}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 bg-green-500" />
        </div>

        {/* Name + Email */}
        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-100 leading-tight">
              {admin?.name ?? "Admin"}
            </p>
            <p className="truncate text-xs text-slate-500 leading-tight mt-0.5">
              {admin?.email ?? "admin@example.com"}
            </p>
          </div>
        )}

        {/* Logout — expanded */}
        {!isCollapsed && (
          <button
            onClick={logout}
            title="Sign out"
            aria-label="Sign out"
            className="shrink-0 rounded-lg p-1.5 text-slate-500 transition-colors duration-150 hover:bg-slate-800 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        )}
      </div>

      {/* Logout — collapsed */}
      {isCollapsed && (
        <div className="pb-3 flex justify-center">
          <button
            onClick={logout}
            title="Sign out"
            aria-label="Sign out"
            className="rounded-lg p-2 text-slate-500 transition-colors duration-150 hover:bg-slate-800 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Sidebar Toggle Button ─────────────────────────────────────────────────────

const CollapseToggle: React.FC<{
  isCollapsed: boolean;
  onClick: () => void;
}> = ({ isCollapsed, onClick }) => (
  <button
    onClick={onClick}
    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    className={cn(
      "absolute -right-3 top-20 z-10",
      "flex h-6 w-6 items-center justify-center",
      "rounded-full border border-slate-700 bg-slate-900 text-slate-400",
      "shadow-md transition-all duration-200",
      "hover:border-slate-600 hover:text-slate-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    )}
  >
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("transition-transform duration-300", isCollapsed && "rotate-180")}
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  </button>
);

// ─── Main Sidebar Component ────────────────────────────────────────────────────

export const Sidebar: React.FC = () => {
  const {
    isSidebarOpen,
    isSidebarCollapsed,
    setSidebarOpen,
    toggleSidebarCollapsed,
  } = useUIStore();

  // Close mobile sidebar on route change
  const pathname = usePathname();
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  // Close mobile sidebar on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setSidebarOpen(false);
      }
    },
    [isSidebarOpen, setSidebarOpen]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const sidebarContent = (
    <nav
      className="flex h-full flex-col bg-slate-900"
      aria-label="Main navigation"
    >
      {/* Brand */}
      <SidebarBrand isCollapsed={isSidebarCollapsed} />

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-hide">
        <div
          className={cn(
            "flex flex-col gap-6",
            isSidebarCollapsed ? "px-2" : "px-3"
          )}
        >
          {NAVIGATION.map((group, groupIndex) => (
            <div key={groupIndex} className="flex flex-col gap-1">
              {/* Group label */}
              {group.groupLabel && !isSidebarCollapsed && (
                <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
                  {group.groupLabel}
                </p>
              )}

              {/* Collapsed group divider */}
              {group.groupLabel && isSidebarCollapsed && groupIndex > 0 && (
                <div className="my-1 h-px bg-slate-800" />
              )}

              {/* Nav items */}
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isCollapsed={isSidebarCollapsed}
                  onClick={() => setSidebarOpen(false)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Admin profile + logout */}
      <SidebarUserProfile isCollapsed={isSidebarCollapsed} />
    </nav>
  );

  return (
    <>
      {/* ── Desktop Sidebar ──────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "relative hidden lg:flex flex-col shrink-0",
          "transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "w-15" : "w-60"
        )}
      >
        {/* Collapse toggle button */}
        <CollapseToggle
          isCollapsed={isSidebarCollapsed}
          onClick={toggleSidebarCollapsed}
        />
        <div className="flex-1 overflow-hidden">{sidebarContent}</div>
      </aside>

      {/* ── Mobile Overlay ───────────────────────────────────────────────────── */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile Drawer ────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60",
          "flex flex-col lg:hidden",
          "transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Mobile navigation"
        aria-hidden={!isSidebarOpen}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;