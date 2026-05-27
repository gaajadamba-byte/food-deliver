"use client";

import React, { useEffect, useState } from "react";
import { AdminStatsCard } from "./AdminStatsCard";
import { apiFetch } from "@/lib/api";
import { ShoppingBag, Utensils, Layers } from "lucide-react";

export const DashboardStats: React.FC = () => {
  const [foods, setFoods] = useState<number | null>(null);
  const [categories, setCategories] = useState<number | null>(null);
  const [orders, setOrders] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const f = (await apiFetch("/food/")) as any[];
        const c = (await apiFetch("/food-category/")) as any[];
        const o = (await apiFetch("/food-order/")) as any[];
        setFoods(Array.isArray(f) ? f.length : null);
        setCategories(Array.isArray(c) ? c.length : null);
        setOrders(Array.isArray(o) ? o.length : null);
      } catch (err) {
        setFoods(null);
        setCategories(null);
        setOrders(null);
      }
    })();
  }, []);

  return (
    <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <AdminStatsCard
        label="Total Orders"
        value={orders ?? "—"}
        tone="accent"
        icon={<ShoppingBag size={24} />}
      />
      <AdminStatsCard
        label="Total Foods"
        value={foods ?? "—"}
        icon={<Utensils size={24} />}
      />
      <AdminStatsCard
        label="Categories"
        value={categories ?? "—"}
        tone="positive"
        icon={<Layers size={24} />}
      />
    </div>
  );
};

export default DashboardStats;
