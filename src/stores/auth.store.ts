import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { tokenManager } from "@/lib/auth/token.manager";
import type { AuthAdmin } from "@/features/auth/types/auth.types";

interface AuthState {
  admin: AuthAdmin | null;       // ← user → admin
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setCredentials: (admin: AuthAdmin, token: string) => void;
  clearCredentials: () => void;
  hydrateFromStorage: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      setCredentials: (admin: AuthAdmin, token: string) => {
        tokenManager.setToken(token);
        tokenManager.setUser(admin);         // ← admin object store karo
        set(
          { admin, token, isAuthenticated: true },
          false,
          "auth/setCredentials"
        );
      },

      clearCredentials: () => {
        tokenManager.clearAll();
        set(
          { admin: null, token: null, isAuthenticated: false },
          false,
          "auth/clearCredentials"
        );
      },

      hydrateFromStorage: () => {
        const token = tokenManager.getToken();
        const admin = tokenManager.getUser<AuthAdmin>();
        set(
          {
            admin: admin ?? null,
            token: token ?? null,
            isAuthenticated: !!token && !!admin,
            isHydrated: true,
          },
          false,
          "auth/hydrateFromStorage"
        );
      },
    }),
    {
      name: "AuthStore",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);