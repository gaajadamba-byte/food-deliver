import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import * as controller from "./food-category.controller";
import {
  createFoodCategorySchema,
  updateFoodCategorySchema,
} from "./food-category.schema";

export const foodCategoryRouter = Router();

foodCategoryRouter.get("/", asyncHandler(controller.list));

foodCategoryRouter.post(
  "/",
  authenticate,
  requireAdmin,
  validateBody(createFoodCategorySchema),
  asyncHandler(controller.create),
);

foodCategoryRouter.patch(
  "/:foodCategoryId",
  authenticate,
  requireAdmin,
  validateBody(updateFoodCategorySchema),
  asyncHandler(controller.update),
);

foodCategoryRouter.delete(
  "/:foodCategoryId",
  authenticate,
  requireAdmin,
  asyncHandler(controller.remove),
);
