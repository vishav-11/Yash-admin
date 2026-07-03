"use client";

import React, { forwardRef } from "react";
import { cn } from "@/utils/cn.utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          // Base styles
          "w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all duration-200",
          // Typography
          "text-slate-900 placeholder:text-slate-400",
          // Default border + background
          "border-slate-200 bg-white",
          // Focus state
          "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
          // Disabled state
          "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 disabled:opacity-60",
          // Error state
          error &&
            "border-red-400 bg-red-50/30 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };