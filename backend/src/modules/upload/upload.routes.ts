import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { uploadImage } from "./upload.controller";
import { uploadSingleImage } from "./upload.middleware";

export const uploadRouter = Router();

uploadRouter.post(
  "/",
  authenticate,
  requireAdmin,
  uploadSingleImage,
  asyncHandler(uploadImage),
);
