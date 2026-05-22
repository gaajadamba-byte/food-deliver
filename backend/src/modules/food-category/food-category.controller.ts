import type { Request, Response } from "express";
import * as service from "./food-category.service";

export async function list(_req: Request, res: Response): Promise<void> {
  res.status(200).json(await service.listCategories());
}

export async function create(req: Request, res: Response): Promise<void> {
  res.status(201).json(await service.createCategory(req.body));
}

export async function update(req: Request, res: Response): Promise<void> {
  const { foodCategoryId } = req.params;
  res.status(200).json(await service.updateCategory(foodCategoryId as string, req.body));
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { foodCategoryId } = req.params;
  res.status(200).json(await service.deleteCategory(foodCategoryId as string));
}
