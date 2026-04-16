import { Router } from "express";
import { AuditLogController } from "../controllers/audit-log.controller";
import { validate } from "../middlewares/validate";
import {
  auditLogByEntityParamsSchema,
  auditLogByEntityQuerySchema,
  auditLogByUserParamsSchema,
  auditLogByUserQuerySchema,
} from "../validators/audit-log.validator";

const router = Router();

router.get(
  "/entity/:entityType/:entityId",
  validate(auditLogByEntityParamsSchema, "params"),
  validate(auditLogByEntityQuerySchema, "query"),
  AuditLogController.getByEntity,
);

router.get(
  "/user/:userId",
  validate(auditLogByUserParamsSchema, "params"),
  validate(auditLogByUserQuerySchema, "query"),
  AuditLogController.getByUser,
);

export default router;
