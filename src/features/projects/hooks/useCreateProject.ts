"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { projectService } from "../services/project.service";
import { queryKeys } from "@/lib/query/query.keys";
import { useToast } from "@/hooks/useToast";
import { parseApiError } from "@/utils/error.utils";
import { ROUTES } from "@/constants/routes.constants";
import type { CreateProjectPayload } from "../types/project.types";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      projectService.createProject(payload),

    onSuccess: (data) => {
      // Invalidate all project lists — forces fresh fetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.lists(),
      });

      toast.success(
        "Project created!",
        `"${data.data.title}" has been created successfully.`
      );

      router.push(ROUTES.PROJECTS.ROOT);
    },

    onError: (error: Error) => {
      toast.error("Failed to create project", parseApiError(error));
    },
  });

  return {
    createProject: mutation.mutate,
    createProjectAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ? parseApiError(mutation.error) : null,
    reset: mutation.reset,
  };
};