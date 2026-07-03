/**
 * UI State Zustand Store
 *
 * Why: Global UI state like sidebar visibility, theme preference,
 * or modal state needs to be shared across multiple unrelated
 * components (e.g., sidebar toggle in Topbar, sidebar visibility
 * in Sidebar and Dashboard layout). Zustand prevents prop drilling
 * for this UI-only state.
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Theme = "light" | "dark" | "system";

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        // ── Sidebar ──────────────────────────────────────────────────────────
        isSidebarOpen: true,
        isSidebarCollapsed: false,

        toggleSidebar: () =>
          set(
            (state) => ({ isSidebarOpen: !state.isSidebarOpen }),
            false,
            "ui/toggleSidebar"
          ),

        setSidebarOpen: (open: boolean) =>
          set({ isSidebarOpen: open }, false, "ui/setSidebarOpen"),

        toggleSidebarCollapsed: () =>
          set(
            (state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed }),
            false,
            "ui/toggleSidebarCollapsed"
          ),

        // ── Theme ────────────────────────────────────────────────────────────
        theme: "system",

        setTheme: (theme: Theme) =>
          set({ theme }, false, "ui/setTheme"),
      }),
      {
        name: "ui-preferences", // localStorage key
        partialize: (state) => ({
          // Only persist these fields, not functions
          isSidebarCollapsed: state.isSidebarCollapsed,
          theme: state.theme,
        }),
      }
    ),
    {
      name: "UIStore",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);