import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { CreateFoodCategoryInput, UpdateFoodCategoryInput } from "./food-category.schema";

async function getCategoryOrThrow(id: string) {
  const category = await prisma.foodCategory.findUnique({ where: { id } });
  if (!category) {
    throw new AppError(404, "Category not found");
  }
  return category;
}

export function listCategories() {
  return prisma.foodCategory.findMany({ orderBy: { createdAt: "asc" } });
}

export async function createCategory(input: CreateFoodCategoryInput) {
  const existing = await prisma.foodCategory.findUnique({
    where: { categoryName: input.categoryName },
  });
  if (existing) {
    throw new AppError(409, "A category with this name already exists");
  }
  return prisma.foodCategory.create({ data: { categoryName: input.categoryName } });
}

export async function updateCategory(id: string, input: UpdateFoodCategoryInput) {
  await getCategoryOrThrow(id);
  return prisma.foodCategory.update({
    where: { id },
    data: { categoryName: input.categoryName },
  });
}

export async function deleteCategory(id: string) {
  await getCategoryOrThrow(id);
  await prisma.foodCategory.delete({ where: { id } });
  return { message: "Category deleted" };
}
