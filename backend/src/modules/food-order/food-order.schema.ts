import { z } from "zod";

export const createFoodOrderSchema = z.object({
  foodOrderItems: z
    .array(
      z.object({
        food: z.string().min(1, "Food id is required"),
        quantity: z.number().int().positive("Quantity must be at least 1"),
      }),
    )
    .min(1, "An order must contain at least one item"),
  address: z.string().min(1, "Address cannot be empty").optional(),
  phoneNumber: z.string().min(6, "Invalid phone number").optional(),
});

const orderStatusEnum = z.enum([
  "PENDING",
  "CANCELED",
  "COOKING",
  "DELIVERING",
  "DELIVERED",
]);

export const updateFoodOrderSchema = z.object({
  status: orderStatusEnum,
});

export const bulkUpdateFoodOrderSchema = z.object({
  orderIds: z.array(z.string().min(1)).min(1, "Provide at least one order id"),
  status: orderStatusEnum,
});

export type CreateFoodOrderInput = z.infer<typeof createFoodOrderSchema>;
export type UpdateFoodOrderInput = z.infer<typeof updateFoodOrderSchema>;
export type BulkUpdateFoodOrderInput = z.infer<typeof bulkUpdateFoodOrderSchema>;
