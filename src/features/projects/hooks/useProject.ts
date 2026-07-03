"use client";

import { useQuery } from "@tanstack/react-query";
import { projectService } from "../services/project.service";
import { queryKeys } from "@/lib/query/query.keys";

export const useProject = (id: string) => {
  const query = useQuery({
    queryKey: queryKeys.projects.detail(id),
    queryFn: () => projectService.getProjectById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });

  return {
    project: query.data?.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};