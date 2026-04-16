import { z } from 'zod';

// ─── Create Assignment ───────────────────────────────────────────────────────

export const createAssignmentSchema = z.object({
  user_id: z
    .string()
    .min(1, 'user_id is required')
    .uuid('user_id must be a valid UUID'),

  assigned_by: z
    .string()
    .min(1, 'assigned_by is required')
    .uuid('assigned_by must be a valid UUID'),
});

// ─── Delete Assignment params ────────────────────────────────────────────────

export const deleteAssignmentParamsSchema = z.object({
  taskId: z
    .string()
    .min(1, 'taskId param is required')
    .uuid('taskId must be a valid UUID'),

  userId: z
    .string()
    .min(1, 'userId param is required')
    .uuid('userId must be a valid UUID'),
});

// ─── TypeScript types ─────────────────────────────────────────────────────────

export type CreateAssignmentInput  = z.infer<typeof createAssignmentSchema>;
export type DeleteAssignmentParams = z.infer<typeof deleteAssignmentParamsSchema>;