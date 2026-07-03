"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";
import { useAuthStore } from "@/stores/auth.store";
import { useToast } from "@/hooks/useToast";
import { DEFAULT_AUTHENTICATED_ROUTE } from "@/constants/routes.constants";
import { parseApiError } from "@/utils/error.utils";
import type { LoginRequest } from "../types/auth.types";

interface UseLoginOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useLogin = (options?: UseLoginOptions) => {
  const router = useRouter();
  const { setCredentials } = useAuthStore();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authService.login(credentials),

    onSuccess: (data) => {
      // ── data.admin aur data.token API se aata hai ──────────────────────────
      setCredentials(data.admin, data.token);

      toast.success(
        "Welcome back!",
        `Signed in as ${data.admin.email}`,
        3000
      );

      options?.onSuccess?.();
      router.push(DEFAULT_AUTHENTICATED_ROUTE);
      router.refresh();
    },

    onError: (error: Error) => {
      const message = parseApiError(error);
      toast.error("Sign in failed", message);
      options?.onError?.(message);
    },
  });

  return {
    login: mutation.mutate,
    loginAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? parseApiError(mutation.error) : null,
    reset: mutation.reset,
  };
};