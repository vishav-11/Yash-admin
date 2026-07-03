import httpClient from "@/lib/api/axios.instance";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
  LoginRequest,
  LoginApiResponse,
  LoginResponse,
} from "../types/auth.types";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await httpClient.post<LoginApiResponse>(
      ENDPOINTS.AUTH.LOGIN,
      credentials
    );

    const { token, admin } = response.data;

    // ── Normalize karo — sirf jo chahiye woh return karo ──────────────────────
    return {
      token,
      admin,
    };
  },

  logout: async (): Promise<void> => {
    try {
      await httpClient.post(ENDPOINTS.AUTH.LOGOUT);
    } catch {
      // Silently ignore — tokens client side pe clear honge
    }
  },
};