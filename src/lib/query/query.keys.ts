import type { PaginationParams } from "@/types";
import type { ProjectFilters } from "@/features/projects/types/project.types";

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },

  photos: {
    all: ["photos"] as const,
    lists: () => [...queryKeys.photos.all, "list"] as const,
    list: (params?: PaginationParams) =>
      [...queryKeys.photos.lists(), params] as const,
    details: () => [...queryKeys.photos.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.photos.details(), id] as const,
  },

  videos: {
    all: ["videos"] as const,
    lists: () => [...queryKeys.videos.all, "list"] as const,
    list: (params?: PaginationParams) =>
      [...queryKeys.videos.lists(), params] as const,
    details: () => [...queryKeys.videos.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.videos.details(), id] as const,
  },

  logos: {
    all: ["logos"] as const,
    lists: () => [...queryKeys.logos.all, "list"] as const,
    list: (params?: PaginationParams) =>
      [...queryKeys.logos.lists(), params] as const,
    details: () => [...queryKeys.logos.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.logos.details(), id] as const,
  },

  dashboard: {
    all: ["dashboard"] as const,
    stats: () => [...queryKeys.dashboard.all, "stats"] as const,
    recentActivity: () =>
      [...queryKeys.dashboard.all, "recent-activity"] as const,
  },

  // ─── Projects ──────────────────────────────────────────────────────────────
  projects: {
    all: ["projects"] as const,
    lists: () => [...queryKeys.projects.all, "list"] as const,
    list: (filters?: ProjectFilters) =>
      [...queryKeys.projects.lists(), filters] as const,
    details: () => [...queryKeys.projects.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.projects.details(), id] as const,
    categories: () => [...queryKeys.projects.all, "categories"] as const,
  },
} as const;