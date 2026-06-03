import { Router } from "express";
import { validateBody } from "../middleware/validate.js";
import * as controller from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.js";
import {
  emailSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "./auth.schema.js";

export const authRouter = Router();

authRouter.post("/sign-up", validateBody(signUpSchema), controller.signUp);
authRouter.post("/sign-in", validateBody(signInSchema), controller.signIn);
authRouter.get("/refresh", controller.refresh);
authRouter.get("/me", authenticate, controller.me);

authRouter.get("/verify-email", controller.verifyEmail);
authRouter.post(
  "/resend-verification",
  validateBody(emailSchema),
  controller.resendVerification,
);

authRouter.post(
  "/reset-password-request",
  validateBody(emailSchema),
  controller.requestPasswordReset,
);
authRouter.get(
  "/verify-reset-password-request",
  controller.verifyResetPasswordRequest,
);
authRouter.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  controller.resetPassword,
);
