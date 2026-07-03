/**
 * Auth Guard Utilities
 *
 * Why: Authentication checks need to happen in layouts,
 * middleware, and some components. Centralizing the logic
 * prevents duplicated auth checking code.
 */

import { tokenManager } from "./token.manager";

/**
 * Checks if the current admin is authenticated
 * by verifying the presence of a valid token.
 *
 * Note: This is a client-side check only.
 * The real security is enforced by the backend via
 * the Authorization header on every API request.
 */
export const isAuthenticated = (): boolean => {
  return tokenManager.hasToken();
};

/**
 * Returns true if the given route is a public route
 * that doesn't require authentication.
 */
export const isPublicRoute = (pathname: string): boolean => {
  const publicRoutes = ["/login", "/forgot-password", "/reset-password"];
  return publicRoutes.some((route) => pathname.startsWith(route));
};

/**
 * Returns true if the given route requires authentication.
 */
export const isProtectedRoute = (pathname: string): boolean => {
  return !isPublicRoute(pathname);
};