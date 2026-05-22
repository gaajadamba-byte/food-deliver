import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import * as controller from "./food.controller";
import { createFoodSchema, updateFoodSchema } from "./food.schema";

export const foodRouter = Router();

foodRouter.get("/", asyncHandler(controller.list));
foodRouter.get("/:categoryId", asyncHandler(controller.listByCategory));

foodRouter.post(
  "/",
  authenticate,
  requireAdmin,
  validateBody(createFoodSchema),
  asyncHandler(controller.create),
);

foodRouter.patch(
  "/:foodId",
  authenticate,
  requireAdmin,
  validateBody(updateFoodSchema),
  asyncHandler(controller.update),
);

foodRouter.delete(
  "/:foodId",
  authenticate,
  requireAdmin,
  asyncHandler(controller.remove),
);
