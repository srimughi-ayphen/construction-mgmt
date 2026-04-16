import { Router } from "express";
import userRoutes from "./user.routes";
import projectRoutes from "./project.routes";
import taskRoutes from "./task.routes";
import milestoneRoutes from "./milestone.routes";
import assignmentRoutes from "./assignment.routes";
import auditLogRoutes from "./audit-log.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/milestones", milestoneRoutes);
router.use("/assignments", assignmentRoutes);
router.use("/audit-logs", auditLogRoutes);
export default router;
