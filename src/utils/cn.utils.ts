import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind CSS classes safely.
 * Combines clsx (conditional classes) + tailwind-merge
 * (removes conflicting Tailwind classes).
 *
 * Usage: cn("px-4", isActive && "bg-blue-500", "px-6")
 * Result: "bg-blue-500 px-6" (px-4 is overridden by px-6)
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};