import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateProjectPayload, ProjectFilters, projectsApi } from '../api/projects';


export const projectKeys = {
  all:     ['projects']              as const,
  lists:   () => [...projectKeys.all, 'list'] as const,
  list:    (f: ProjectFilters) => [...projectKeys.lists(), f] as const,
  details: () => [...projectKeys.all, 'detail'] as const,
  detail:  (id: string) => [...projectKeys.details(), id] as const,
};

export function useProjects(filters: ProjectFilters = {}) {
  return useQuery({
    queryKey: projectKeys.list(filters),
    queryFn:  () => projectsApi.getAll(filters),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn:  () => projectsApi.getById(id),
    enabled:  Boolean(id),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectsApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<CreateProjectPayload>) => projectsApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });
}