import httpClient from "@/lib/api/axios.instance";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type {
  ProjectsListResponse,
  SingleProjectResponse,
  CategoriesResponse,
  DeleteProjectResponse,
  ProjectFilters,
  CreateProjectPayload,
  UpdateProjectPayload,
  DeleteMediaPayload,
} from "../types/project.types";

const buildParams = (
  filters: ProjectFilters
): Record<string, string> => {
  const params: Record<string, string> = {};

  if (filters.page !== undefined) params.page = String(filters.page);
  if (filters.limit !== undefined) params.limit = String(filters.limit);
  if (filters.category) params.category = filters.category;
  if (filters.featured !== undefined)
    params.featured = String(filters.featured);
  if (filters.published !== undefined)
    params.published = String(filters.published);
  if (filters.search) params.search = filters.search;

  return params;
};

export const projectService = {
  getProjects: async (
    filters: ProjectFilters = {}
  ): Promise<ProjectsListResponse> => {
    const response = await httpClient.get(ENDPOINTS.PROJECTS.LIST, {
      params: buildParams(filters),
    });

    // Log actual response shape in development
    if (process.env.NODE_ENV === "development") {
      console.log("[ALL Project List] Response:", response.data);
    }

    // Return raw response.data — useProjects hook will parse the shape
    return response.data;
  },

  getProjectById: async (id: string): Promise<SingleProjectResponse> => {
    const response = await httpClient.get<SingleProjectResponse>(
      ENDPOINTS.PROJECTS.DETAILS(id)
    );
    return response.data;
  },

  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await httpClient.get<CategoriesResponse>(
      ENDPOINTS.PROJECTS.CATEGORIES
    );
    return response.data;
  },

  createProject: async (
    payload: CreateProjectPayload
  ): Promise<SingleProjectResponse> => {
    const formData = new FormData();

    formData.append("title", payload.title);
    formData.append("description", payload.description);
    formData.append("category", payload.category);
    formData.append("featured", String(payload.featured));
    formData.append("published", String(payload.published));
    formData.append("tags", JSON.stringify(payload.tags));
    formData.append("tools", JSON.stringify(payload.tools));

    if (payload.client) {
      formData.append("client", payload.client);
    }

    if (payload.media && payload.media.length > 0) {
      payload.media.forEach((file) => {
        formData.append("media", file);
      });
    }

    const response = await httpClient.post<SingleProjectResponse>(
      ENDPOINTS.PROJECTS.CREATE,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  },

  updateProject: async (
    payload: UpdateProjectPayload
  ): Promise<SingleProjectResponse> => {
    const formData = new FormData();

    if (payload.title !== undefined) formData.append("title", payload.title);
    if (payload.description !== undefined)
      formData.append("description", payload.description);
    if (payload.category !== undefined)
      formData.append("category", payload.category);
    if (payload.featured !== undefined)
      formData.append("featured", String(payload.featured));
    if (payload.published !== undefined)
      formData.append("published", String(payload.published));
    if (payload.client !== undefined)
      formData.append("client", payload.client);
    if (payload.tags !== undefined)
      formData.append("tags", JSON.stringify(payload.tags));
    if (payload.tools !== undefined)
      formData.append("tools", JSON.stringify(payload.tools));

    if (payload.media && payload.media.length > 0) {
      payload.media.forEach((file) => {
        formData.append("media", file);
      });
    }

    const response = await httpClient.put<SingleProjectResponse>(
      ENDPOINTS.PROJECTS.UPDATE(payload.id),
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  },

  deleteProject: async (id: string): Promise<DeleteProjectResponse> => {
    const response = await httpClient.delete<DeleteProjectResponse>(
      ENDPOINTS.PROJECTS.DELETE(id)
    );
    return response.data;
  },

  deleteProjectMedia: async (
    payload: DeleteMediaPayload
  ): Promise<DeleteProjectResponse> => {
    const response = await httpClient.delete<DeleteProjectResponse>(
      ENDPOINTS.PROJECTS.DELETE_MEDIA(
        payload.projectId,
        payload.publicId,
        payload.type
      )
    );
    return response.data;
  },
};