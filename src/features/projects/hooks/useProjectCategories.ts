"use client";

import { useQuery } from "@tanstack/react-query";
import { projectService } from "../services/project.service";
import { queryKeys } from "@/lib/query/query.keys";
import type { CategoryOption } from "../types/project.types";

// ── Normalize categories to consistent shape ───────────────────────────────────
const normalizeCategories = (
  data: CategoryOption[] | string[]
): CategoryOption[] => {
  if (!data || data.length === 0) return [];

  if (typeof data[0] === "string") {
    return (data as string[]).map((cat) => ({
      value: cat,
      label: cat
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" "),
    }));
  }

  return data as CategoryOption[];
};

export const useProjectCategories = () => {
  const query = useQuery({
    queryKey: queryKeys.projects.categories(),
    queryFn: () => projectService.getCategories(),
    staleTime: 10 * 60 * 1000,    // Categories rarely change
    gcTime: 30 * 60 * 1000,
  });

  const normalized = normalizeCategories(query.data?.data ?? []);

  return {
    categories: normalized,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};