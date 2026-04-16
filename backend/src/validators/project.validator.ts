import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(200, 'Name must be under 200 characters'),

  description: z.string()
    .max(2000, 'Description must be under 2000 characters')
    .optional(),

  status: z.enum(['planning', 'active', 'on_hold', 'completed'])
    .optional(),

  start_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'start_date must be YYYY-MM-DD'),

  end_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'end_date must be YYYY-MM-DD')
    .optional(),

  created_by: z.string()
    .uuid('created_by must be a valid UUID'),
});

export const updateProjectSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(200)
    .optional(),

  description: z.string()
    .max(2000)
    .optional(),

  status: z.enum(['planning', 'active', 'on_hold', 'completed'])
    .optional(),

  start_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'start_date must be YYYY-MM-DD')
    .optional(),

  end_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'end_date must be YYYY-MM-DD')
    .optional(),

}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;
export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;