import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api";

export function useUsers(filters: { role?: string } = {}) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.role) params.set("role", filters.role);
      const { data } = await apiClient.get(`/users?${params.toString()}`);
      return data;
    },
  });
}
