"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "../services/project.service";
import { queryKeys } from "@/lib/query/query.keys";
import { useToast } from "@/hooks/useToast";
import { parseApiError } from "@/utils/error.utils";
import type { DeleteMediaPayload, Project } from "../types/project.types";

export const useDeleteProjectMedia = (projectId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (payload: DeleteMediaPayload) =>
      projectService.deleteProjectMedia(payload),

    // ── Optimistic: remove media from project detail cache ──────────────────
    onMutate: async (payload: DeleteMediaPayload) => {
      // Cancel any in-flight refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({
        queryKey: queryKeys.projects.detail(projectId),
      });

      // Snapshot current value for rollback
      const previousProject = queryClient.getQueryData<{ data: Project }>(
        queryKeys.projects.detail(projectId)
      );

      // Optimistically remove the media item
      queryClient.setQueryData(
        queryKeys.projects.detail(projectId),
        (old: { data: Project } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              media: old.data.media.filter(
                (m) => m.publicId !== payload.publicId
              ),
            },
          };
        }
      );

      return { previousProject };
    },

    onSuccess: () => {
      toast.success("Media deleted", "The media file has been removed.");
    },

    onError: (error: Error, _payload, context) => {
      // Rollback optimistic update on error
      if (context?.previousProject) {
        queryClient.setQueryData(
          queryKeys.projects.detail(projectId),
          context.previousProject
        );
      }
      toast.error("Failed to delete media", parseApiError(error));
    },

    onSettled: () => {
      // Always refetch to sync server state
      queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(projectId),
      });
    },
  });

  return {
    deleteMedia: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error ? parseApiError(mutation.error) : null,
    reset: mutation.reset, // ✅ reset expose kiya
  };
};