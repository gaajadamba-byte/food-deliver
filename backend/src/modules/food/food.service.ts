import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { CreateFoodInput, UpdateFoodInput } from "./food.schema";

async function getFoodOrThrow(id: string) {
  const food = await prisma.food.findUnique({ where: { id } });
  if (!food) {
    throw new AppError(404, "Food not found");
  }
  return food;
}

async function ensureCategoryExists(categoryId: string) {
  const category = await prisma.foodCategory.findUnique({ where: { id: categoryId } });
  if (!category) {
    throw new AppError(404, "Category not found");
  }
}

export function listFoods() {
  return prisma.food.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export function listFoodsByCategory(categoryId: string) {
  return prisma.food.findMany({
    where: { categoryId },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });
}

export async function createFood(input: CreateFoodInput) {
  await ensureCategoryExists(input.categoryId);
  return prisma.food.create({ data: input, include: { category: true } });
}

export async function updateFood(id: string, input: UpdateFoodInput) {
  await getFoodOrThrow(id);
  if (input.categoryId) {
    await ensureCategoryExists(input.categoryId);
  }
  return prisma.food.update({ where: { id }, data: input, include: { category: true } });
}

export async function deleteFood(id: string) {
  await getFoodOrThrow(id);
  await prisma.food.delete({ where: { id } });
  return { message: "Food deleted" };
}
