"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../services/project.service";
import { queryKeys } from "@/lib/query/query.keys";
import { useToast } from "@/hooks/useToast";
import { parseApiError } from "@/utils/error.utils";
import type { Project } from "../types/project.types";

// ─── Helper: normalize any cached list shape ───────────────────────────────────
type CachedListShape =
  | Project[]
  | { data: Project[] }
  | { data: { data: Project[] } }
  | { data: { projects: Project[]; total: number; page: number; pages: number } }
  | { projects: Project[]; total: number; page: number; pages: number }
  | undefined;

const filterProjectFromCache = (old: CachedListShape, id: string): CachedListShape => {
  if (!old) return old;

  // Shape: Project[]  (raw array)
  if (Array.isArray(old)) {
    return old.filter((p) => p._id !== id);
  }

  // Shape: { data: Project[] }
  if ("data" in old && Array.isArray(old.data)) {
    return { ...old, data: old.data.filter((p) => p._id !== id) };
  }

  // Shape: { data: { data: Project[] } }  (double nested)
  if (
    "data" in old &&
    old.data !== null &&
    typeof old.data === "object" &&
    "data" in (old.data as object) &&
    Array.isArray((old.data as { data: Project[] }).data)
  ) {
    const inner = old.data as { data: Project[] };
    return {
      ...old,
      data: {
        ...inner,
        data: inner.data.filter((p) => p._id !== id),
      },
    };
  }

  // Shape: { data: { projects: Project[] } }
  if (
    "data" in old &&
    old.data !== null &&
    typeof old.data === "object" &&
    "projects" in (old.data as object)
  ) {
    const inner = old.data as { projects: Project[]; total: number; page: number; pages: number };
    return {
      ...old,
      data: {
        ...inner,
        projects: inner.projects.filter((p) => p._id !== id),
      },
    };
  }

  // Shape: { projects: Project[] }
  if ("projects" in old && Array.isArray(old.projects)) {
    return {
      ...old,
      projects: old.projects.filter((p) => p._id !== id),
    };
  }

  return old;
};

// ──────────────────────────────────────────────────────────────────────────────

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),

    onMutate: async (id: string) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.projects.lists(),
      });

      // Snapshot all cached list queries
      const previousProjects = queryClient.getQueriesData<CachedListShape>({
        queryKey: queryKeys.projects.lists(),
      });

      // Optimistically remove from every cached list (handles all shapes)
      queryClient.setQueriesData(
        { queryKey: queryKeys.projects.lists() },
        (old: CachedListShape) => filterProjectFromCache(old, id)
      );

      return { previousProjects };
    },

    onSuccess: (_, id) => {
      // Remove detail cache for deleted project
      queryClient.removeQueries({
        queryKey: queryKeys.projects.detail(id),
      });

      toast.success("Project deleted", "The project has been removed.");
    },

    onError: (error: Error, _, context) => {
      // Rollback all cached lists to previous state
      if (context?.previousProjects) {
        context.previousProjects.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to delete project", parseApiError(error));
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.lists(),
      });
    },
  });

  return {
    deleteProject: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error ? parseApiError(mutation.error) : null,
    reset: mutation.reset,
  };
};