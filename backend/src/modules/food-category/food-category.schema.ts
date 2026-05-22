import { z } from "zod";

export const createFoodCategorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
});

export const updateFoodCategorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
});

export type CreateFoodCategoryInput = z.infer<typeof createFoodCategorySchema>;
export type UpdateFoodCategoryInput = z.infer<typeof updateFoodCategorySchema>;
