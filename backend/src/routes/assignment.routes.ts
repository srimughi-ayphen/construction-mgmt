import { Router } from "express";
import { AssignmentController } from "../controllers/assignment.controller";
import { validate } from "../middlewares/validate";
import { createAssignmentSchema, deleteAssignmentParamsSchema } from "../validators/assignment.validator";


const router = Router();

router.get("/:taskId", AssignmentController.getAssignmentByTask);
router.post("/:taskId",validate(createAssignmentSchema), AssignmentController.createAssignment);
router.delete("/:taskId/:userId",validate(deleteAssignmentParamsSchema), AssignmentController.deleteAssignment);
export default router;