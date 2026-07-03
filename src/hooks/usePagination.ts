/**
 * usePagination Hook
 *
 * Why: Pagination logic (current page, page size, navigation)
 * is needed across all list pages. A shared hook prevents
 * duplicating this stateful logic in every list component.
 */

import { useState, useCallback } from "react";
import { PAGINATION } from "@/constants";

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

interface UsePaginationReturn {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  resetPagination: () => void;
}

export const usePagination = (
  options: UsePaginationOptions = {}
): UsePaginationReturn => {
  const {
    initialPage = PAGINATION.DEFAULT_PAGE,
    initialLimit = PAGINATION.DEFAULT_LIMIT,
  } = options;

  const [page, setPageState] = useState<number>(initialPage);
  const [limit, setLimitState] = useState<number>(initialLimit);

  const setPage = useCallback((newPage: number) => {
    if (newPage < 1) return;
    setPageState(newPage);
  }, []);

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(newLimit);
    setPageState(1); // Reset to first page when changing page size
  }, []);

  const nextPage = useCallback(() => {
    setPageState((prev) => prev + 1);
  }, []);

  const previousPage = useCallback(() => {
    setPageState((prev) => Math.max(1, prev - 1));
  }, []);

  const resetPagination = useCallback(() => {
    setPageState(initialPage);
    setLimitState(initialLimit);
  }, [initialPage, initialLimit]);

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    previousPage,
    resetPagination,
  };
};