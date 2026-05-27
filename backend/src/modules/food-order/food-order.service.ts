import type { FoodOrderStatus } from "../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type { CreateFoodOrderInput } from "./food-order.schema";

const orderInclude = {
  foodOrderItems: { include: { food: true } },
  user: {
    select: { id: true, email: true, phoneNumber: true, address: true },
  },
} as const;

export async function createOrder(userId: string, input: CreateFoodOrderInput) {
  const foodIds = input.foodOrderItems.map((item) => item.food);
  const foods = await prisma.food.findMany({ where: { id: { in: foodIds } } });
  const priceById = new Map(foods.map((food) => [food.id, food.price]));

  let totalPrice = 0;
  const items = input.foodOrderItems.map((item) => {
    const price = priceById.get(item.food);
    if (price === undefined) {
      throw new AppError(404, `Food not found: ${item.food}`);
    }
    totalPrice += price * item.quantity;
    return { foodId: item.food, quantity: item.quantity };
  });

  // The delivery address lives on the User record (per the ERD), so capture
  // any address/phone supplied at checkout onto the user before ordering.
  if (input.address || input.phoneNumber) {
    await prisma.user.update({
      where: { id: userId },
      data: { address: input.address, phoneNumber: input.phoneNumber },
    });
  }

  const order = await prisma.foodOrder.create({
    data: {
      userId,
      totalPrice,
      foodOrderItems: { create: items },
    },
    include: orderInclude,
  });

  // Track which foods this user has ordered (ERD: User.orderedFoods).
  await prisma.user.update({
    where: { id: userId },
    data: {
      orderedFoods: { connect: [...new Set(foodIds)].map((id) => ({ id })) },
    },
  });

  return order;
}

export function listAllOrders() {
  return prisma.foodOrder.findMany({
    orderBy: { createdAt: "desc" },
    include: orderInclude,
  });
}

export function listOrdersByUser(userId: string) {
  return prisma.foodOrder.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: orderInclude,
  });
}

export async function updateOrderStatus(id: string, status: FoodOrderStatus) {
  const order = await prisma.foodOrder.findUnique({ where: { id } });
  if (!order) {
    throw new AppError(404, "Order not found");
  }
  return prisma.foodOrder.update({
    where: { id },
    data: { status },
    include: orderInclude,
  });
}

/** Updates the status of many orders at once (admin). */
export async function bulkUpdateOrderStatus(
  orderIds: string[],
  status: FoodOrderStatus,
) {
  const result = await prisma.foodOrder.updateMany({
    where: { id: { in: orderIds } },
    data: { status },
  });
  return { updated: result.count, status };
}
