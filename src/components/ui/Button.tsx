"use client";

import React, { forwardRef } from "react";
import { cn } from "@/utils/cn.utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-blue-600 text-white border-transparent",
    "hover:bg-blue-700 active:bg-blue-800",
    "focus:ring-blue-500/30",
    "disabled:bg-blue-300 disabled:cursor-not-allowed"
  ),
  secondary: cn(
    "bg-white text-slate-700 border-slate-200",
    "hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100",
    "focus:ring-slate-500/20",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  ),
  ghost: cn(
    "bg-transparent text-slate-600 border-transparent",
    "hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200",
    "focus:ring-slate-500/20",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  ),
  danger: cn(
    "bg-red-600 text-white border-transparent",
    "hover:bg-red-700 active:bg-red-800",
    "focus:ring-red-500/30",
    "disabled:bg-red-300 disabled:cursor-not-allowed"
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base
          "inline-flex items-center justify-center",
          "rounded-lg border font-medium",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          "select-none whitespace-nowrap",
          // Variant
          variantStyles[variant],
          // Size
          sizeStyles[size],
          // Full width util
          className
        )}
        {...props}
      >
        {/* Loading spinner */}
        {isLoading && (
          <svg
            className="animate-spin shrink-0"
            width={size === "sm" ? 14 : 16}
            height={size === "sm" ? 14 : 16}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
              strokeOpacity="0.25"
            />
            <path
              d="M12 2a10 10 0 0 1 10 10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* Left icon (hidden when loading) */}
        {!isLoading && leftIcon && (
          <span className="shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {children}

        {/* Right icon */}
        {!isLoading && rightIcon && (
          <span className="shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };