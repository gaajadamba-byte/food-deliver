"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { formatPrice } from "@/lib/format";
import type { FoodOrder, FoodOrderStatus } from "@/lib/types";

const STATUS_LABEL: Record<FoodOrderStatus, string> = {
  PENDING: "Pending",
  COOKING: "Cooking",
  DELIVERING: "Delivering",
  DELIVERED: "Delivered",
  CANCELED: "Canceled",
};

const STATUS_STYLE: Record<FoodOrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  COOKING: "bg-orange-100 text-orange-700",
  DELIVERING: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELED: "bg-red-100 text-red-700",
};

export function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<FoodOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;

    apiFetch<FoodOrder[]>(`/food-order/${user.id}`)
      .then((data) => active && setOrders(data))
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Алдаа гарлаа");
        }
      });

    return () => {
      active = false;
    };
  }, [user]);

  if (!user) {
    return (
      <p className="py-16 text-center text-sm text-gray-400">
        Захиалгаа харахын тулд нэвтэрнэ үү.
      </p>
    );
  }

  if (error) {
    return <p className="py-16 text-center text-sm text-gray-400">{error}</p>;
  }

  if (!orders) {
    return (
      <p className="py-16 text-center text-sm text-gray-400">Ачааллаж байна…</p>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-gray-400">
        Захиалгын түүх алга байна.
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {orders.map((order) => (
        <div key={order.id} className="py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-800">
              {formatPrice(order.totalPrice)}
            </span>
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${STATUS_STYLE[order.status]}`}
            >
              {STATUS_LABEL[order.status]}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            {order.foodOrderItems.length} хоол ·{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
