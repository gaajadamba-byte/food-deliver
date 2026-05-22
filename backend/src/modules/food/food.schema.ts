import { z } from "zod";

export const createFoodSchema = z.object({
  foodName: z.string().min(1, "Food name is required"),
  price: z.number().positive("Price must be greater than 0"),
  image: z.string().min(1, "Image is required"),
  ingredients: z.string().min(1, "Ingredients are required"),
  categoryId: z.string().min(1, "Category is required"),
});

export const updateFoodSchema = z
  .object({
    foodName: z.string().min(1).optional(),
    price: z.number().positive().optional(),
    image: z.string().min(1).optional(),
    ingredients: z.string().min(1).optional(),
    categoryId: z.string().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export type CreateFoodInput = z.infer<typeof createFoodSchema>;
export type UpdateFoodInput = z.infer<typeof updateFoodSchema>;
