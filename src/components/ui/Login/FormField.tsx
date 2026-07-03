import React from "react";
import { cn } from "@/utils/cn.utils";
import { Label } from "../Label";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

const FormField = ({
  label,
  htmlFor,
  error,
  required,
  hint,
  children,
  className,
}: FormFieldProps) => {
  return (
    <div className={cn("flex flex-col", className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>

      {children}

      {/* Hint text */}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-slate-400">{hint}</p>
      )}

      {/* Error message */}
      {error && (
        <p
          className="mt-1.5 flex items-center gap-1 text-xs text-red-500"
          role="alert"
          aria-live="polite"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export { FormField };