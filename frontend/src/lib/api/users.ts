import { User, ApiResponse } from "../types/index";
import { apiClient } from "./client";

export const usersApi = {
  // Get all users
  async getAll(
    params: {
      role?: string;
      includeInactive?: boolean;
    } = {},
  ): Promise<ApiResponse<User[]>> {
    const query = new URLSearchParams();

    if (params.role) {
      query.set("role", params.role);
    }

    if (params.includeInactive) {
      query.set("includeInactive", "true");
    }

    const { data } = await apiClient.get(`/users?${query.toString()}`);

    return data;
  },

  // Get user by ID
  async getById(id: string): Promise<ApiResponse<User>> {
    const { data } = await apiClient.get(`/users/${id}`);

    return data;
  },

  // Create user
  async create(payload: {
    name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<ApiResponse<User>> {
    const { data } = await apiClient.post("/users", payload);

    return data;
  },

  // Update user
  async update(
    id: string,
    payload: {
      name?: string;
      role?: string;
    },
  ): Promise<ApiResponse<User>> {
    const { data } = await apiClient.put(`/users/${id}`, payload);

    return data;
  },

  // Delete user
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};
