export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH_TOKEN: "/api/auth/refresh",
    ME: "/api/auth/me",
  },
  PHOTOS: {
    GET_ALL: "/api/photos",
    GET_BY_ID: (id: string | number) => `/api/photos/${id}`,
    UPLOAD: "/api/photos/upload",
    UPDATE: (id: string | number) => `/api/photos/${id}`,
    DELETE: (id: string | number) => `/api/photos/${id}`,
  },
  VIDEOS: {
    GET_ALL: "/api/videos",
    GET_BY_ID: (id: string | number) => `/api/videos/${id}`,
    UPLOAD: "/api/videos/upload",
    UPDATE: (id: string | number) => `/api/videos/${id}`,
    DELETE: (id: string | number) => `/api/videos/${id}`,
  },
  LOGOS: {
    GET_ALL: "/api/logos",
    GET_BY_ID: (id: string | number) => `/api/logos/${id}`,
    UPLOAD: "/api/logos/upload",
    UPDATE: (id: string | number) => `/api/logos/${id}`,
    DELETE: (id: string | number) => `/api/logos/${id}`,
  },
  PROJECTS: {
    LIST: "/api/projects",
    DETAILS: (id: string) => `/api/projects/${id}`,
    CREATE: "/api/projects",
    UPDATE: (id: string) => `/api/projects/${id}`,
    DELETE: (id: string) => `/api/projects/${id}`,
    CATEGORIES: "/api/projects/categories",
    DELETE_MEDIA: (projectId: string, publicId: string, type: string) =>
      `/api/projects/${projectId}/media/${encodeURIComponent(publicId)}?type=${type}`,
  },
} as const;