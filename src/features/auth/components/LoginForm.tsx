"use client";

/**
 * LoginForm
 *
 * useId() fix: Next.js 14+ mein useId() SSR aur CSR pe
 * same ID generate karta hai — yeh safe hai.
 * Lekin ensure karo component "use client" marked hai.
 */

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormSchema } from "../schemas/auth.schema";
import { cn } from "@/utils/cn.utils";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    login,
    isLoading,
    error: mutationError,
    reset: resetMutation,
  } = useLogin({
    onError: (message) => {
      setServerError(message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const onSubmit = (data: LoginFormSchema) => {
    setServerError(null);
    resetMutation();
    login({ email: data.email, password: data.password });
  };

  const handleInputChange = () => {
    if (serverError) {
      setServerError(null);
      resetMutation();
    }
  };

  const displayError = serverError ?? mutationError;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-label="Login form"
      className="flex flex-col gap-5"
    >
      {/* ── Error Banner ─────────────────────────────────────────────────────── */}
      {displayError && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
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
            className="mt-0.5 shrink-0 text-red-500"
            aria-hidden="true"
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>{displayError}</span>
        </div>
      )}

      {/* ── Email Field ───────────────────────────────────────────────────────── */}
      <FormField
        label="Email address"
        htmlFor="login-email"
        error={errors.email?.message}
        required
      >
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </span>
          <Input
            id="login-email"
            type="email"
            placeholder="admin@example.com"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            className="pl-10"
            {...register("email", { onChange: handleInputChange })}
          />
        </div>
      </FormField>

      {/* ── Password Field ────────────────────────────────────────────────────── */}
      <FormField
        label="Password"
        htmlFor="login-password"
        error={errors.password?.message}
        required
      >
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            autoComplete="current-password"
            error={!!errors.password}
            className="pl-10 pr-11"
            {...register("password", { onChange: handleInputChange })}
          />
          {/* Toggle password visibility */}
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              "rounded p-1 text-slate-400",
              "transition-colors duration-150 hover:text-slate-600",
              "focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-1"
            )}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" y1="2" x2="22" y2="22" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        </div>
      </FormField>

      {/* ── Submit Button ──────────────────────────────────────────────────────── */}
      <Button
        type="submit"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading || !isDirty}
        className="mt-1 w-full"
        aria-label={isLoading ? "Signing in, please wait" : "Sign in"}
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
};

export default LoginForm;