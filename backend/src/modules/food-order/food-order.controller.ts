import type { Request, Response } from "express";
import { AppError } from "../../utils/AppError";
import * as service from "./food-order.service";

export async function create(req: Request, res: Response): Promise<void> {
  const userId = req.user!.userId;
  res.status(201).json(await service.createOrder(userId, req.body));
}

export async function listAll(_req: Request, res: Response): Promise<void> {
  res.status(200).json(await service.listAllOrders());
}

export async function listByUser(req: Request, res: Response): Promise<void> {
  const { userId } = req.params;
  const requester = req.user!;

  // A user may only read their own orders; admins may read anyone's.
  if (requester.role !== "ADMIN" && requester.userId !== userId) {
    throw new AppError(403, "You can only view your own orders");
  }

  res.status(200).json(await service.listOrdersByUser(userId as string));
}

export async function updateStatus(req: Request, res: Response): Promise<void> {
  const { foodOrderId } = req.params;
  res.status(200).json(await service.updateOrderStatus(foodOrderId as string, req.body.status));
}

export async function bulkUpdateStatus(req: Request, res: Response): Promise<void> {
  const { orderIds, status } = req.body;
  res.status(200).json(await service.bulkUpdateOrderStatus(orderIds, status));
}
