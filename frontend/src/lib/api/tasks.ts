
import { ApiResponse, PaginatedResponse, Task} from "../types/index";
import { apiClient } from "./client";

//  Filters

export interface TaskFilters {
  status?: string;
  priority?: string;
  page?: number;
  limit?: number;
}

//  Create Payload

export interface CreateTaskPayload {
  project_id: string;
  milestone_id?: string | null;
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
  created_by: string;
}

//  API Methods

export const tasksApi = {
  // Get tasks by project
  async getByProject(
    projectId: string,
    filters: TaskFilters = {},
  ): Promise<PaginatedResponse<Task>> {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "") {
        params.set(key, String(value));
      }
    });

    const { data } = await apiClient.get(
      `/projects/${projectId}/tasks?${params.toString()}`,
    );

    return data;
  },

  // Get task by ID
  async getById(id: string): Promise<ApiResponse<Task>> {
    const { data } = await apiClient.get(`/tasks/${id}`);

    return data;
  },

  // Create task
  async create(payload: CreateTaskPayload): Promise<ApiResponse<Task>> {
    const { data } = await apiClient.post("/tasks", payload);

    return data;
  },

  // Update task
  async update(
    id: string,
    payload: Partial<CreateTaskPayload>,
  ): Promise<ApiResponse<Task>> {
    const { data } = await apiClient.put(`/tasks/${id}`, payload);

    return data;
  },

  // Update task status (quick update)
  async updateStatus(id: string, status: string): Promise<ApiResponse<Task>> {
    const { data } = await apiClient.patch(`/tasks/${id}/status`, { status });

    return data;
  },

  // Delete task
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },
};
