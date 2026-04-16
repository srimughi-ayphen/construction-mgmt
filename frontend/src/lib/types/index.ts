// ── Enums ─────────────────────────────────────────────────────

export type UserRole = 'admin' | 'manager' | 'worker';

export type ProjectStatus =
  | 'planning'
  | 'active'
  | 'on_hold'
  | 'completed';

export type TaskStatus =
  | 'todo'
  | 'in_progress'
  | 'in_review'
  | 'done'
  | 'blocked';

export type TaskPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'critical';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  start_date: string;
  end_date: string | null;
  created_by: string;

  // Optional relations
  creator?: Pick<User, "id" | "name" | "email">;

  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  project_id: string;
  name: string;
  due_date: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  milestone_id: string | null;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_by: string;

  // Optional relations
  milestone?: Pick<Milestone, "id" | "name" | "due_date">;
  creator?: Pick<User, "id" | "name" | "email">;
  assignments?: Assignment[];

  created_at: string;
  updated_at: string;
}

export interface Assignment {
  id: string;
  task_id: string;
  user_id: string;
  assigned_by: string;
  assigned_at: string;

  // Optional relations
  assignee?: Pick<User, "id" | "name" | "email" | "role">;
  assigner?: Pick<User, "id" | "name" | "email">;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  success: false;
  error: string;
}
