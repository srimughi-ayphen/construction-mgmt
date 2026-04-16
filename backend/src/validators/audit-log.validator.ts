import { z } from 'zod';

// ─── Valid action types ───────────────────────────────────────────────────────

export const AUDIT_ACTIONS = [
  'CREATE',
  'UPDATE',
  'DELETE',
  'STATUS_CHANGE',
  'ASSIGN',
  'UNASSIGN',
] as const;

// ─── Valid entity types ───────────────────────────────────────────────────────

export const AUDIT_ENTITY_TYPES = [
  'user',
  'project',
  'milestone',
  'task',
  'assignment',
] as const;

// ─── Params: GET /audit-logs/entity/:entityType/:entityId ────────────────────

export const auditLogByEntityParamsSchema = z.object({
  entityType: z.enum(AUDIT_ENTITY_TYPES, {
    message: `entityType must be one of: ${AUDIT_ENTITY_TYPES.join(', ')}`,
  }),

  entityId: z
    .string()
    .min(1, 'entityId is required')
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, 'entityId must be a valid UUID'),
});

// ─── Query: ?page=&limit= ─────────────────────────────────────────────────────

export const auditLogByEntityQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : 1))
    .pipe(z.number().min(1, 'page must be at least 1')),

  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : 20))
    .pipe(z.number().min(1, 'limit must be at least 1').max(100, 'limit cannot exceed 100')),
});

// ─── Params: GET /audit-logs/user/:userId ────────────────────────────────────

export const auditLogByUserParamsSchema = z.object({
  userId: z
    .string()
    .min(1, 'userId is required')
    .regex(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/, 'userId must be a valid UUID'),
});

// reuse same page/limit rules
export const auditLogByUserQuerySchema = auditLogByEntityQuerySchema;

// ─── TypeScript types ─────────────────────────────────────────────────────────

export type AuditLogByEntityParams = z.infer<typeof auditLogByEntityParamsSchema>;
export type AuditLogByUserParams   = z.infer<typeof auditLogByUserParamsSchema>;
export type AuditLogQueryInput     = z.infer<typeof auditLogByEntityQuerySchema>;