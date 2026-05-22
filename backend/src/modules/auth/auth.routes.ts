import { Router } from "express";
import { validateBody } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import * as controller from "./auth.controller";
import { emailSchema, resetPasswordSchema, signInSchema, signUpSchema } from "./auth.schema";

export const authRouter = Router();

authRouter.post("/sign-up", validateBody(signUpSchema), asyncHandler(controller.signUp));
authRouter.post("/sign-in", validateBody(signInSchema), asyncHandler(controller.signIn));
authRouter.get("/refresh", asyncHandler(controller.refresh));

authRouter.get("/verify-email", asyncHandler(controller.verifyEmail));
authRouter.post(
  "/resend-verification",
  validateBody(emailSchema),
  asyncHandler(controller.resendVerification),
);

authRouter.post(
  "/reset-password-request",
  validateBody(emailSchema),
  asyncHandler(controller.requestPasswordReset),
);
authRouter.get(
  "/verify-reset-password-request",
  asyncHandler(controller.verifyResetPasswordRequest),
);
authRouter.post(
  "/reset-password",
  validateBody(resetPasswordSchema),
  asyncHandler(controller.resetPassword),
);
