import { Router } from "express";
import { authenticate, requireAdmin } from "../../middleware/auth";
import { validateBody } from "../../middleware/validate";
import { asyncHandler } from "../../utils/asyncHandler";
import * as controller from "./food-order.controller";
import {
  bulkUpdateFoodOrderSchema,
  createFoodOrderSchema,
  updateFoodOrderSchema,
} from "./food-order.schema";

export const foodOrderRouter = Router();

foodOrderRouter.post(
  "/",
  authenticate,
  validateBody(createFoodOrderSchema),
  asyncHandler(controller.create),
);

foodOrderRouter.get("/", authenticate, requireAdmin, asyncHandler(controller.listAll));

// Bulk status update (admin) — defined before "/:userId" / "/:foodOrderId".
foodOrderRouter.patch(
  "/",
  authenticate,
  requireAdmin,
  validateBody(bulkUpdateFoodOrderSchema),
  asyncHandler(controller.bulkUpdateStatus),
);

foodOrderRouter.get("/:userId", authenticate, asyncHandler(controller.listByUser));

foodOrderRouter.patch(
  "/:foodOrderId",
  authenticate,
  requireAdmin,
  validateBody(updateFoodOrderSchema),
  asyncHandler(controller.updateStatus),
);
