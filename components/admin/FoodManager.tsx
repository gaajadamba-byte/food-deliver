"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Food = {
  id: string;
  foodName: string;
  price: number;
  image: string;
  categoryId: string;
};
type Category = { id: string; categoryName: string };

export const FoodManager: React.FC = () => {
  const [items, setItems] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  async function load() {
    try {
      const [foodsData, categoriesData] = await Promise.all([
        apiFetch("/food/") as Promise<Food[]>,
        apiFetch("/food-category/") as Promise<Category[]>,
      ]);
      setItems(foodsData);
      setCategories(categoriesData);
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

  const filteredItems = selectedCategoryId
    ? items.filter((f) => f.categoryId === selectedCategoryId)
    : items;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Total: {filteredItems.length}
        </div>
        <Link
          className="rounded bg-slate-800 px-3 py-2 text-white transition-colors hover:bg-slate-700"
          href="/admin/foods/new"
        >
          Add food
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 border-b pb-4">
        <button
          onClick={() => setSelectedCategoryId(null)}
          className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
            selectedCategoryId === null
              ? "bg-slate-800 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Бүгд
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategoryId(cat.id)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              selectedCategoryId === cat.id
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat.categoryName}
          </button>
        ))}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((f) => (
          <li key={f.id} className="flex flex-col rounded border bg-white p-3">
            <div className="mb-2 h-40 w-full overflow-hidden rounded bg-slate-100">
              {f.image ? (
                <img
                  src={f.image}
                  alt={f.foodName}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <div className="flex flex-1 flex-col gap-3">
              <div className="min-w-0">
                <div
                  className="truncate font-medium text-slate-900"
                  title={f.foodName}
                >
                  {f.foodName}
                </div>
                <div className="text-sm font-semibold text-slate-500">
                  ${f.price.toFixed(2)}
                </div>
              </div>
              <div className="mt-auto flex gap-2">
                <Link
                  className="flex-1 cursor-pointer rounded bg-amber-500 py-1.5 text-center text-xs font-medium text-white transition-colors hover:bg-amber-600"
                  href={`/admin/foods/${f.id}`}
                >
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => remove(f.id)}
                  className="flex-1 cursor-pointer rounded bg-red-500 py-1.5 text-center text-xs font-medium text-white transition-colors hover:bg-red-600"
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
