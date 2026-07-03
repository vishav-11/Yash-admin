"use client";

import { useQuery } from "@tanstack/react-query";
import { projectService } from "../services/project.service";
import { queryKeys } from "@/lib/query/query.keys";
import type {
  Project,
  ProjectFilters,
  ProjectPaginationMeta,
} from "../types/project.types";

// ─── Safe Array Extractor ──────────────────────────────────────────────────────

const extractProjects = (rawData: unknown): Project[] => {
  if (!rawData) return [];

  // Direct array
  if (Array.isArray(rawData)) return rawData as Project[];

  const data = rawData as Record<string, unknown>;

  // { data: Project[] }
  if (Array.isArray(data.data)) return data.data as Project[];

  // { data: { data: Project[] } }
  if (data.data && typeof data.data === "object") {
    const nested = data.data as Record<string, unknown>;
    if (Array.isArray(nested.data)) return nested.data as Project[];
  }

  // { projects: Project[] }
  if (Array.isArray(data.projects)) return data.projects as Project[];

  return [];
};

// ─── Safe Pagination Extractor ─────────────────────────────────────────────────

const extractPagination = (rawData: unknown): ProjectPaginationMeta | undefined => {
  if (!rawData) return undefined;

  const data = rawData as Record<string, unknown>;

  // { pagination: {...} }
  if (data.pagination && typeof data.pagination === "object") {
    return data.pagination as ProjectPaginationMeta;
  }

  // { data: { pagination: {...} } }
  if (data.data && typeof data.data === "object") {
    const nested = data.data as Record<string, unknown>;
    if (nested.pagination && typeof nested.pagination === "object") {
      return nested.pagination as ProjectPaginationMeta;
    }
  }

  return undefined;
};

// ─── Hook ──────────────────────────────────────────────────────────────────────

export const useProjects = (filters: ProjectFilters = {}) => {
  const query = useQuery({
    queryKey: queryKeys.projects.list(filters),
    queryFn: () => projectService.getProjects(filters),
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });

  // Log actual response shape in dev
  if (process.env.NODE_ENV === "development" && query.data) {
    console.log("[useProjects] Raw API response:", query.data.data);
  }

  const tryl=query.data?.data;
  const responseData = query.data?.data;


const projects =
  responseData &&
  !Array.isArray(responseData) &&
  "projects" in responseData
    ? responseData.projects
    : [];
console.log("strhjfnd",tryl)
  // const projects: Project[] = extractProjects(query.data);
  const pagination: ProjectPaginationMeta | undefined = extractPagination(query.data);

  return {
    projects,                          // ← always Project[]
    pagination,                        // ← ProjectPaginationMeta | undefined
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};