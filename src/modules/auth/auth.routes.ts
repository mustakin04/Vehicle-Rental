import { Router } from "express";
import { body } from "express-validator";
import { authControllers } from "./auth.controller";
import { handleValidation } from "../../middleware/validate.middleware";

const router = Router();

router.post(
  "/signup",
  handleValidation,
  authControllers.signup
);

router.post(
  "/signin",
  [
    body("email").isEmail(),
    body("password").notEmpty()
  ],
  handleValidation,
  authControllers.signin
);

export default router;
