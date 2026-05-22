import type { Request, Response } from "express";
import * as service from "./food.service";

export async function list(_req: Request, res: Response): Promise<void> {
  res.status(200).json(await service.listFoods());
}

export async function listByCategory(req: Request, res: Response): Promise<void> {
  const { categoryId } = req.params;
  res.status(200).json(await service.listFoodsByCategory(categoryId as string));
}

export async function create(req: Request, res: Response): Promise<void> {
  res.status(201).json(await service.createFood(req.body));
}

export async function update(req: Request, res: Response): Promise<void> {
  const { foodId } = req.params;
  res.status(200).json(await service.updateFood(foodId as string, req.body));
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { foodId } = req.params;
  res.status(200).json(await service.deleteFood(foodId as string));
}
