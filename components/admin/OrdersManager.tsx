"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Order = {
  id: string;
  userId: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  user?: {
    email: string;
    phoneNumber?: string;
    address?: string;
  };
};

export const OrdersManager: React.FC = () => {
  const [items, setItems] = useState<Order[]>([]);

  async function load() {
    try {
      const data = (await apiFetch("/food-order/")) as Order[];
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function bulkUpdate(status: string) {
    const ids = items.map((i) => i.id);
    if (!ids.length) return;
    try {
      await apiFetch("/food-order/", {
        method: "PATCH",
        body: { orderIds: ids, status },
      });
      load();
      try {
        const { toast } = await import("sonner");
        toast.success("Orders updated");
      } catch {}
    } catch (err) {
      console.error(err);
      try {
        const { toast } = await import("sonner");
        toast.error(String((err as any)?.message ?? "Update failed"));
      } catch {}
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Total orders: {items.length}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => bulkUpdate("COOKING")}
            className="rounded bg-amber-500 px-3 py-2 text-white transition-colors hover:bg-amber-600"
          >
            Set Cooking
          </button>
          <button
            onClick={() => bulkUpdate("DELIVERING")}
            className="rounded bg-sky-600 px-3 py-2 text-white transition-colors hover:bg-sky-700"
          >
            Set Delivering
          </button>
        </div>
      </div>

      <ul className="space-y-2">
        {items.map((o) => (
          <li
            key={o.id}
            className="flex items-center justify-between rounded border bg-white p-3"
          >
            <div>
              <div className="font-medium">Order {o.id}</div>
              <div className="mt-1 flex flex-col gap-0.5">
                <div className="text-sm text-slate-700 font-medium">
                  Хэрэглэгч: {o.user?.email || o.userId}
                </div>
                <div className="text-xs text-slate-500">
                  {o.user?.phoneNumber && `📞 ${o.user.phoneNumber} | `} 📍{" "}
                  {o.user?.address || "Хаяг тодорхойгүй"}
                </div>
                <div className="text-sm font-semibold text-amber-600">
                  {o.totalPrice.toLocaleString()}₮
                </div>
              </div>
              <div className="text-sm text-slate-500">
                {new Date(o.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-slate-100 px-3 py-1 text-sm">
                {o.status}
              </div>
              <Link
                className="rounded bg-amber-500 px-3 py-1 text-white transition-colors hover:bg-amber-600"
                href={`/admin/orders/${o.id}`}
              >
                View
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
