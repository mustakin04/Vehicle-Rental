import { Router } from "express";
import { body } from "express-validator";
import { userControllers } from "./users.controller";
import { handleValidation } from "../../middleware/validate.middleware";
import { authenticate, authorize } from "../../middleware/auth.middleware";

const router = Router();

router.post(
  "/",
  authenticate,
  authorize("admin"),
  handleValidation,
  userControllers.createUser
);

router.get("/", authenticate, authorize("admin"), userControllers.getUser);
router.get("/:userId", authenticate, userControllers.getSingleUser);
router.put("/:userId", authenticate, userControllers.updateUser);
router.delete("/:userId", authenticate, authorize("admin"), userControllers.deleted);

export default router;
