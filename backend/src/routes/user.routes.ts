import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { validate } from "../middlewares/validate";
import {
  createUserSchema,
  updateUserSchema,
} from "../validators/user.validator";

const router = Router();

router.get("/", UserController.getAll);
router.get("/:id", UserController.getById);
router.delete("/:id", UserController.remove);
router.post("/", validate(createUserSchema), UserController.create);
router.put("/:id", validate(updateUserSchema), UserController.update);

export default router;
