"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Food = { id: string; foodName: string; price: number; image: string };

export const FoodManager: React.FC = () => {
  const [items, setItems] = useState<Food[]>([]);

  async function load() {
    try {
      const data = (await apiFetch("/food/")) as Food[];
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string) {
    if (!confirm("Delete this food item?")) return;
    try {
      await apiFetch(`/food/${id}`, { method: "DELETE" });
      load();
      // feedback
      try {
        const { toast } = await import("sonner");
        toast.success("Food deleted");
      } catch {}
    } catch (err) {
      console.error(err);
      try {
        const { toast } = await import("sonner");
        toast.error(String((err as any)?.message ?? "Delete failed"));
      } catch {}
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-slate-600">Total: {items.length}</div>
        <Link
          className="rounded bg-slate-800 px-3 py-2 text-white"
          href="/admin/foods/new"
        >
          Add food
        </Link>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => (
          <li key={f.id} className="rounded border bg-white p-3">
            <div className="mb-2 h-40 w-full overflow-hidden rounded bg-slate-100">
              {f.image ? (
                <img
                  src={f.image}
                  alt={f.foodName}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{f.foodName}</div>
                <div className="text-sm text-slate-500">
                  ${f.price.toFixed(2)}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Link
                  className="mb-2 rounded bg-amber-500 px-2 py-1 text-white"
                  href={`/admin/foods/${f.id}`}
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => remove(f.id)}
                  className="rounded bg-red-500 px-2 py-1 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
