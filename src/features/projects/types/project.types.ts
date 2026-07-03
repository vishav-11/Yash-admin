import type { Timestamps } from "@/types/common.types";

// ─── Media ─────────────────────────────────────────────────────────────────────

export type MediaType = "image" | "video";

export interface ProjectMedia {
  _id: string;
  url: string;
  publicId: string;
  type: MediaType;
  thumbnailUrl?: string;
  duration?: number;
  width?: number;
  height?: number;
  size?: number;
  format?: string;
}

// ─── Category ─────────────────────────────────────────────────────────────────

export type ProjectCategory =
  | "logo_design"
  | "brand_identity"
  | "ui_ux_design"
  | "web_design"
  | "print_design"
  | "illustration"
  | "motion_graphics"
  | "video_editing"
  | "reels_animation_motion"
  | "photography"
  | "social_media"
  | "packaging"
  | "other";

export const VIDEO_CATEGORIES: ProjectCategory[] = [
  "reels_animation_motion",
  "video_editing",
  "motion_graphics",
];

export interface CategoryOption {
  value: ProjectCategory | string;
  label: string;
  count?: number;
}

// ─── Project ───────────────────────────────────────────────────────────────────

export interface Project extends Timestamps {
  _id: string;
  title: string;
  description: string;
  category: ProjectCategory | string;
  tags: string[];
  tools: string[];
  client?: string;
  featured: boolean;
  published: boolean;
  coverImage?: string;
  media: ProjectMedia[];
  slug?: string;
  order?: number;
}

// ─── Pagination ────────────────────────────────────────────────────────────────

// ← Named export so pages can import it directly
export interface ProjectPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ─── API Response Shapes ───────────────────────────────────────────────────────

type ProjectsData =
  | Project[]
  | { data: Project[] }
  | {
      projects: Project[];
      total: number;
      page: number;
      pages: number;
    };

export interface ProjectsListResponse {
  success: boolean;
  data?: ProjectsData;
}

export interface SingleProjectResponse {
  success: boolean;
  data: Project;
}

export interface CategoriesResponse {
  success: boolean;
  data: CategoryOption[] | string[];
}

export interface DeleteProjectResponse {
  success: boolean;
  message: string;
}

// ─── Filters ───────────────────────────────────────────────────────────────────

export interface ProjectFilters {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  published?: boolean;
  search?: string;
}

// ─── Form Values ───────────────────────────────────────────────────────────────

export interface CreateProjectFormValues {
  title: string;
  description: string;
  category: string;
  tags: string;
  tools: string;
  client?: string;
  featured: boolean;
  published: boolean;
  media: FileList | null;
}

export interface UpdateProjectFormValues extends CreateProjectFormValues {
  id: string;
}

// ─── API Payloads ──────────────────────────────────────────────────────────────

export interface CreateProjectPayload {
  title: string;
  description: string;
  category: string;
  tags: string[];
  tools: string[];
  client?: string;
  featured: boolean;
  published: boolean;
  media?: File[];
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {
  id: string;
}

export interface DeleteMediaPayload {
  projectId: string;
  publicId: string;
  type: MediaType;
}