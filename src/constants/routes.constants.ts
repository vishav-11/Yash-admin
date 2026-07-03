export const ROUTES = {
  AUTH: {
    LOGIN: "/login",
  },
  DASHBOARD: {
    ROOT: "/dashboard",
  },
  PHOTOS: {
    ROOT: "/photos",
    UPLOAD: "/photos/upload",
    DETAIL: (id: string | number) => `/photos/${id}`,
  },
  VIDEOS: {
    ROOT: "/videos",
    UPLOAD: "/videos/upload",
    DETAIL: (id: string | number) => `/videos/${id}`,
  },
  LOGOS: {
    ROOT: "/logos",
    UPLOAD: "/logos/upload",
    DETAIL: (id: string | number) => `/logos/${id}`,
  },
  PROJECTS: {
    ROOT: "/projects",
    CREATE: "/projects/create",
    DETAIL: (id: string) => `/projects/${id}`,
    EDIT: (id: string) => `/projects/${id}/edit`,
  },
  VIDEO_PROJECTS: {
    ROOT: "/video-projects",
  },
} as const;

export const PUBLIC_ROUTES: string[] = [ROUTES.AUTH.LOGIN];
export const DEFAULT_AUTHENTICATED_ROUTE = ROUTES.DASHBOARD.ROOT;
export const DEFAULT_UNAUTHENTICATED_ROUTE = ROUTES.AUTH.LOGIN;