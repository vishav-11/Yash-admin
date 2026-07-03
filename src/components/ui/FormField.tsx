"use client";

/**
 * FormField Component
 *
 * The universal form field wrapper used across every form in the app.
 * Works seamlessly with React Hook Form + Zod validation.
 *
 * Why this exists:
 * Without this, every form field would need to manually repeat:
 *   - <label> with htmlFor
 *   - error message <p> with role="alert"
 *   - hint text <p>
 *   - required indicator
 *   - aria-describedby linking input to its error/hint
 *   - character count display
 *
 * With FormField, you write this once and reuse it everywhere.
 *
 * Usage with React Hook Form:
 *   <FormField
 *     label="Email address"
 *     htmlFor="email"
 *     error={errors.email?.message}
 *     required
 *   >
 *     <Input id="email" {...register("email")} />
 *   </FormField>
 *
 * Usage with character count:
 *   <FormField
 *     label="Bio"
 *     htmlFor="bio"
 *     error={errors.bio?.message}
 *     currentLength={watch("bio")?.length}
 *     maxLength={200}
 *   >
 *     <Textarea id="bio" {...register("bio")} />
 *   </FormField>
 *
 * Usage with hint:
 *   <FormField
 *     label="Slug"
 *     htmlFor="slug"
 *     hint="Auto-generated from title. You can override it."
 *     error={errors.slug?.message}
 *   >
 *     <Input id="slug" {...register("slug")} />
 *   </FormField>
 */

import React, { useId } from "react";
import { cn } from "@/utils/cn.utils";

// ─── Types ─────────────────────────────────────────────────────────────────────

type FormFieldSize = "sm" | "md" | "lg";

export interface FormFieldProps {
  /** The visible label text rendered above the field */
  label: string;

  /** Must match the id of the child input element for a11y */
  htmlFor: string;

  /** Children — the actual input, textarea, select, etc. */
  children: React.ReactNode;

  /** Zod / RHF error message string. Renders red error below field */
  error?: string;

  /** Helper text shown below the field when there is no error */
  hint?: string;

  /** Shows a red asterisk (*) next to the label */
  required?: boolean;

  /** Grays out the entire field group visually */
  disabled?: boolean;

  /** Controls vertical spacing and label size */
  size?: FormFieldSize;

  /** Current character count (for textarea/input with maxLength) */
  currentLength?: number;

  /** Maximum allowed characters — enables the counter display */
  maxLength?: number;

  /** Optional description rendered between label and input */
  description?: string;

  /** Optional content rendered to the right of the label (e.g. a link) */
  labelSuffix?: React.ReactNode;

  /** Additional class for the outer wrapper div */
  className?: string;
}

// ─── Size Configs ──────────────────────────────────────────────────────────────

const SIZE_CONFIGS: Record<
  FormFieldSize,
  {
    labelText: string;
    spacing: string;
    metaText: string;
  }
> = {
  sm: {
    labelText: "text-xs font-medium",
    spacing: "gap-1",
    metaText: "text-xs",
  },
  md: {
    labelText: "text-sm font-medium",
    spacing: "gap-1.5",
    metaText: "text-xs",
  },
  lg: {
    labelText: "text-base font-medium",
    spacing: "gap-2",
    metaText: "text-sm",
  },
};

// ─── Sub-components ────────────────────────────────────────────────────────────

// Label row: label text + optional suffix (e.g. "Forgot password?" link)
const FieldLabel = ({
  htmlFor,
  label,
  required,
  suffix,
  labelClassName,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
  suffix?: React.ReactNode;
  labelClassName: string;
}) => (
  <div className="flex items-center justify-between gap-2">
    <label
      htmlFor={htmlFor}
      className={cn("block text-slate-700 leading-none", labelClassName)}
    >
      {label}
      {required && (
        <span
          className="ml-1 text-red-500 select-none"
          aria-hidden="true"
          title="Required"
        >
          *
        </span>
      )}
    </label>

    {/* Optional right-side content e.g. "Forgot password?" */}
    {suffix && (
      <div className="shrink-0 text-xs text-slate-500">{suffix}</div>
    )}
  </div>
);

// Optional descriptive text between label and input
const FieldDescription = ({
  description,
  descriptionId,
  textClassName,
}: {
  description: string;
  descriptionId: string;
  textClassName: string;
}) => (
  <p
    id={descriptionId}
    className={cn("text-slate-500 leading-snug", textClassName)}
  >
    {description}
  </p>
);

// Hint shown when no error — subtle gray helper text
const FieldHint = ({
  hint,
  hintId,
  textClassName,
}: {
  hint: string;
  hintId: string;
  textClassName: string;
}) => (
  <p
    id={hintId}
    className={cn("flex items-center gap-1.5 text-slate-400", textClassName)}
  >
    {/* Info dot icon */}
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 mt-px"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
    {hint}
  </p>
);

// Error message — shown when error prop has a value
const FieldError = ({
  error,
  errorId,
  textClassName,
}: {
  error: string;
  errorId: string;
  textClassName: string;
}) => (
  <p
    id={errorId}
    role="alert"
    aria-live="polite"
    className={cn(
      "flex items-start gap-1.5 text-red-500 font-medium",
      textClassName
    )}
  >
    {/* Warning triangle icon */}
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 mt-px"
      aria-hidden="true"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
    <span>{error}</span>
  </p>
);

// Character counter — right-aligned, turns red when near/at limit
const CharacterCounter = ({
  current,
  max,
  textClassName,
}: {
  current: number;
  max: number;
  textClassName: string;
}) => {
  const remaining = max - current;
  const isNearLimit = remaining <= Math.floor(max * 0.1); // < 10% remaining
  const isAtLimit = current >= max;

  return (
    <p
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${current} of ${max} characters used`}
      className={cn(
        "ml-auto tabular-nums transition-colors duration-200",
        textClassName,
        !isNearLimit && "text-slate-400",
        isNearLimit && !isAtLimit && "text-amber-500 font-medium",
        isAtLimit && "text-red-500 font-semibold"
      )}
    >
      {current}
      <span className="text-slate-300 mx-0.5">/</span>
      {max}
    </p>
  );
};

// ─── Main FormField Component ──────────────────────────────────────────────────

export const FormField = ({
  label,
  htmlFor,
  children,
  error,
  hint,
  required = false,
  disabled = false,
  size = "md",
  currentLength,
  maxLength,
  description,
  labelSuffix,
  className,
}: FormFieldProps) => {
  // Generate stable IDs for aria-describedby linking
  const uid = useId();
  const errorId = `${uid}-error`;
  const hintId = `${uid}-hint`;
  const descriptionId = `${uid}-description`;

  const { labelText, spacing, metaText } = SIZE_CONFIGS[size];

  // Build aria-describedby value — links input to its helper text
  // Screen readers read these IDs when the input is focused
  const describedByIds: string[] = [];
  if (description) describedByIds.push(descriptionId);
  if (error) describedByIds.push(errorId);
  else if (hint) describedByIds.push(hintId);
  const ariaDescribedBy =
    describedByIds.length > 0 ? describedByIds.join(" ") : undefined;

  // Show character counter only when maxLength is provided
  const showCharCount =
    maxLength !== undefined && currentLength !== undefined;

  // Bottom meta row is visible if there's an error, hint, or character count
  const showMetaRow = !!error || !!hint || showCharCount;

  return (
    <div
      className={cn(
        "flex flex-col",
        spacing,
        // Disabled state dims the entire field group
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className
      )}
    >
      {/* ── Label Row ───────────────────────────────────────────────────────── */}
      <FieldLabel
        htmlFor={htmlFor}
        label={label}
        required={required}
        suffix={labelSuffix}
        labelClassName={labelText}
      />

      {/* ── Optional Description ─────────────────────────────────────────────── */}
      {description && (
        <FieldDescription
          description={description}
          descriptionId={descriptionId}
          textClassName={metaText}
        />
      )}

      {/* ── Input Area ──────────────────────────────────────────────────────── */}
      {/*
        We clone the child element to inject:
        - aria-invalid when there's an error
        - aria-describedby linking it to error/hint IDs
        - aria-required for screen readers
        This means child inputs get full a11y without manual wiring.
      */}
      <div className="relative">
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return child;

          return React.cloneElement(
            child as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
            {
              "aria-invalid": error ? "true" : undefined,
              "aria-describedby": ariaDescribedBy,
              "aria-required": required ? "true" : undefined,
              ...(child.props as object),
            }
          );
        })}
      </div>

      {/* ── Bottom Meta Row: hint | error | character count ─────────────────── */}
      {showMetaRow && (
        <div className="flex items-start justify-between gap-2">
          {/* Left side: error OR hint */}
          <div className="flex-1">
            {error ? (
              <FieldError
                error={error}
                errorId={errorId}
                textClassName={metaText}
              />
            ) : hint ? (
              <FieldHint
                hint={hint}
                hintId={hintId}
                textClassName={metaText}
              />
            ) : null}
          </div>

          {/* Right side: character counter */}
          {showCharCount && (
            <CharacterCounter
              current={currentLength!}
              max={maxLength!}
              textClassName={metaText}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FormField;