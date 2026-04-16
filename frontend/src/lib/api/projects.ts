import { ApiResponse, PaginatedResponse, Project } from "../types";
import { apiClient } from "./client";

// ── Filters ─────────────────────────────────────────────

export interface ProjectFilters {
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ── Create Payload ──────────────────────────────────────

export interface CreateProjectPayload {
  name: string;
  description?: string;
  status?: string;
  start_date: string;
  end_date?: string;
  created_by: string;
}

// ── API Methods ─────────────────────────────────────────

export const projectsApi = {
  // Get all projects (with filters + pagination)
  async getAll(
    filters: ProjectFilters = {},
  ): Promise<PaginatedResponse<Project>> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    });

    const { data } = await apiClient.get(`/projects?${params.toString()}`);

    return data;
  },

  // Get project by ID
  async getById(id: string): Promise<ApiResponse<Project>> {
    const { data } = await apiClient.get(`/projects/${id}`);

    return data;
  },

  // Create project
  async create(payload: CreateProjectPayload): Promise<ApiResponse<Project>> {
    const { data } = await apiClient.post("/projects", payload);

    return data;
  },

  // Update project
  async update(
    id: string,
    payload: Partial<CreateProjectPayload>,
  ): Promise<ApiResponse<Project>> {
    const { data } = await apiClient.put(`/projects/${id}`, payload);

    return data;
  },

  // Delete project
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/projects/${id}`);
  },

  // Get project members
  async getMembers(id: string): Promise<ApiResponse<unknown[]>> {
    const { data } = await apiClient.get(`/projects/${id}/members`);

    return data;
  },
};
