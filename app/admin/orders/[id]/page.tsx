"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

type OrderItem = {
  id: string;
  foodId: string;
  quantity: number;
  food: { foodName: string; price: number; image?: string };
};
type Order = {
  id: string;
  userId: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  foodOrderItems: OrderItem[];
};

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [status, setStatus] = useState<string>("PENDING");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const list = (await apiFetch("/food-order/")) as Order[];
        const found = list.find((o) => o.id === id) ?? null;
        if (!found) {
          toast.error("Order not found");
        }
        setOrder(found);
        setStatus(found?.status ?? "PENDING");
      } catch (err) {
        console.error(err);
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function saveStatus() {
    if (!order) return;
    setUpdating(true);
    try {
      await apiFetch(`/food-order/${order.id}`, {
        method: "PATCH",
        body: { status },
      });
      toast.success("Order status updated");
      setOrder({ ...order, status });
    } catch (err: any) {
      console.error(err);
      toast.error(String(err?.message ?? "Update failed"));
    } finally {
      setUpdating(false);
    }
  }

  if (!id) return <div className="p-6">Missing id</div>;

  return (
    <AdminGuard>
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">Order {id}</h1>
        <div className="rounded-lg bg-white p-6 shadow">
          {loading ? (
            <div>Loading…</div>
          ) : order ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-600">
                    User: {order.userId}
                  </div>
                  <div className="text-sm text-slate-600">
                    Created: {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-lg font-medium">
                  Total: ${order.totalPrice.toFixed(2)}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Status</label>
                <div className="mt-2 flex items-center gap-3">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded border px-3 py-2"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="COOKING">COOKING</option>
                    <option value="DELIVERING">DELIVERING</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELED">CANCELED</option>
                  </select>
                  <button
                    onClick={saveStatus}
                    disabled={updating}
                    className="rounded bg-slate-800 px-3 py-2 text-white"
                  >
                    {updating ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>

              <div>
                <h2 className="mb-2 text-lg font-medium">Items</h2>
                <ul className="space-y-2">
                  {order.foodOrderItems.map((it) => (
                    <li
                      key={it.id}
                      className="flex items-center gap-4 rounded border p-3"
                    >
                      <div className="h-20 w-20 overflow-hidden rounded bg-slate-100">
                        {it.food?.image ? (
                          <img
                            src={it.food.image}
                            alt={it.food.foodName}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{it.food?.foodName}</div>
                        <div className="text-sm text-slate-500">
                          Qty: {it.quantity}
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        ${(it.food?.price ?? 0).toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div>Order not found</div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
