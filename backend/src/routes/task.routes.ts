import { Router } from "express";
import { TaskController } from "../controllers/task.controller";
import { AssignmentController } from "../controllers/assignment.controller";
import { validate } from "../middlewares/validate";
import { updateStatusSchema, updateTaskSchema } from "../validators/task.validator";
import { createAssignmentSchema } from "../validators/assignment.validator";

const router = Router();

router.get("/:id", TaskController.getTaskById);
router.put("/:id", validate(updateTaskSchema), TaskController.updateTask);
router.delete("/:id", TaskController.deleteTask);
router.patch("/:id/status", validate(updateStatusSchema), TaskController.updateStatus);

router.get("/:taskId/assignments", AssignmentController.getAssignmentByTask);
router.post("/:taskId/assignments", validate(createAssignmentSchema), AssignmentController.createAssignment);
router.delete("/:taskId/assignments/:userId", AssignmentController.deleteAssignment);

export default router;
