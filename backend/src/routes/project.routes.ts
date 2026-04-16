import { Router } from "express";
import { ProjectController } from "../controllers/project.controller";
import { validate } from "../middlewares/validate";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.validator";
import { MilestoneController } from "../controllers/milestone.controller";
import { TaskController } from "../controllers/task.controller";
import { createMilestoneSchema } from "../validators/milestone.validator";
import { createTaskSchema } from "../validators/task.validator";

const router = Router();

router.get("/", ProjectController.getAllProjects);
router.get("/:id", ProjectController.getById);
router.post("/", validate(createProjectSchema), ProjectController.create);
router.put("/:id", validate(updateProjectSchema), ProjectController.update);
router.delete("/:id", ProjectController.remove);

router.post("/:projectId/milestones", validate(createMilestoneSchema), MilestoneController.createMilestone);
router.get("/:projectId/milestones", MilestoneController.getMilestonesByProjectId);

router.post("/:projectId/tasks", validate(createTaskSchema), TaskController.createTask);
router.get("/:projectId/tasks", TaskController.getTasksByProjectId);

export default router;
