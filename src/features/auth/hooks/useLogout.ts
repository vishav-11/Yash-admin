/**
 * useLogout Custom Hook
 *
 * Why: Logout needs to:
 * 1. Call the backend (optional but best practice)
 * 2. Clear Zustand store
 * 3. Clear React Query cache (sensitive data shouldn't persist)
 * 4. Redirect to login
 *
 * Having this in a hook means any component (Topbar,
 * sidebar menu, admin dropdown) can call logout()
 * with consistent behavior everywhere.
 */

"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { DEFAULT_UNAUTHENTICATED_ROUTE } from "@/constants/routes.constants";

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearCredentials } = useAuthStore();

  const logout = useCallback(async () => {
    try {
      // 1. Notify the backend (fire and forget — don't await)
      authService.logout().catch(() => {
        // Silently ignore — we logout client-side regardless
      });
    } finally {
      // 2. Clear Zustand auth store + localStorage
      clearCredentials();

      // 3. Clear ALL React Query caches
      // (prevents sensitive data from leaking to next admin)
      queryClient.clear();

      // 4. Redirect to login
      router.push(DEFAULT_UNAUTHENTICATED_ROUTE);
      router.refresh();
    }
  }, [clearCredentials, queryClient, router]);

  return { logout };
};