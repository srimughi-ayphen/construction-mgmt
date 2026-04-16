import { Router } from "express";
import { MilestoneController } from "../controllers/milestone.controller";
import { validate } from "../middlewares/validate";
import { updateMilestoneSchema } from "../validators/milestone.validator";

const router = Router();

router.get("/:id", MilestoneController.getMilestoneById);
router.put("/:id", validate(updateMilestoneSchema), MilestoneController.updateMilestone);
router.patch("/:id/complete", MilestoneController.completeMilestone);
router.delete("/:id", MilestoneController.deleteMilestone);

export default router;
