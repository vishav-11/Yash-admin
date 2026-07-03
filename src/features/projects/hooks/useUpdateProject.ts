"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { projectService } from "../services/project.service";
import { queryKeys } from "@/lib/query/query.keys";
import { useToast } from "@/hooks/useToast";
import { parseApiError } from "@/utils/error.utils";
import { ROUTES } from "@/constants/routes.constants";
import type { UpdateProjectPayload } from "../types/project.types";

export const useUpdateProject = (projectId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (payload: UpdateProjectPayload) =>
      projectService.updateProject(payload),

    onSuccess: (data) => {
      // Invalidate this specific project + all lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.lists(),
      });

      toast.success(
        "Project updated!",
        `"${data.data.title}" has been updated successfully.`
      );

      router.push(ROUTES.PROJECTS.DETAIL(projectId));
    },

    onError: (error: Error) => {
      toast.error("Failed to update project", parseApiError(error));
    },
  });

  return {
    updateProject: mutation.mutate,
    updateProjectAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? parseApiError(mutation.error) : null,
    reset: mutation.reset,
  };
};