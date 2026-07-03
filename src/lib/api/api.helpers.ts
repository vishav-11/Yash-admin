
import type { PaginationParams } from "@/types";

/**
 * Converts a params object to clean query string params,
 * removing undefined and null values automatically.
 */
export const buildQueryParams = (
  params: Record<string, string | number | boolean | undefined | null>
): Record<string, string> => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>
    );
};

/**
 * Builds standard pagination params for list endpoints.
 */
export const buildPaginationParams = (
  params: PaginationParams
): Record<string, string> => {
  return buildQueryParams({
    page: params.page ?? 1,
    limit: params.limit ?? 12,
    search: params.search,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
  });
};

/**
 * Creates a multipart/form-data config for file uploads.
 * Axios automatically sets the correct Content-Type header
 * with boundary when FormData is passed as the body.
 */
export const getMultipartConfig = () => ({
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

/**
 * Extracts the data from a standard API response envelope.
 * Use this in service functions to unwrap response.data.data.
 */
export const extractResponseData = <T>(
  response: { data: { data: T } }
): T => {
  return response.data.data;
};