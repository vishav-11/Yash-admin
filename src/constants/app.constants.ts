/**
 * Application-level constants.
 *
 * Why: Magic strings/numbers in code are a maintenance nightmare.
 * Named constants are self-documenting and centrally managed.
 */

export const APP_NAME = "Portfolio Admin";

export const APP_VERSION = "1.0.0";

// ─── Stale Time Presets for React Query ───────────────────────────────────────

export const STALE_TIME = {
  SHORT: 30 * 1000,          // 30 seconds (frequently changing data)
  MEDIUM: 5 * 60 * 1000,    // 5 minutes (standard data)
  LONG: 30 * 60 * 1000,     // 30 minutes (rarely changing data)
  NEVER: Infinity,           // Never stale (static config data)
} as const;

// ─── Cache Time Presets ────────────────────────────────────────────────────────

export const CACHE_TIME = {
  SHORT: 2 * 60 * 1000,     // 2 minutes
  MEDIUM: 10 * 60 * 1000,   // 10 minutes
  LONG: 60 * 60 * 1000,     // 1 hour
} as const;

// ─── Pagination Defaults ───────────────────────────────────────────────────────

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  LIMIT_OPTIONS: [12, 24, 48, 96],
} as const;

// ─── Toast Duration ────────────────────────────────────────────────────────────

export const TOAST_DURATION = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000,
} as const;