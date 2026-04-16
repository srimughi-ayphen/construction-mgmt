import z from "zod";

export const createTaskSchema   = z.object({
  title: z.string().min(2).max(300),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  milestone_id: z.string().uuid().optional(),
  created_by: z.string().uuid(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(2).max(300).optional(),
  description: z.string().max(2000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  milestone_id: z.string().uuid().nullable().optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' });

export const updateStatusSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'in_review', 'done', 'blocked']),
});