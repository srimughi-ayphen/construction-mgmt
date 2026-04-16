import z from "zod";

export const createMilestoneSchema = z.object({
  name: z.string().min(2).max(200),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
});

export const updateMilestoneSchema = z.object({
  name: z.string().min(2).max(200).optional(),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'At least one field required' });
