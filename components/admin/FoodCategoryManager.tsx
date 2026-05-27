"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

type Category = { id: string; categoryName: string };

export const FoodCategoryManager: React.FC = () => {
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState("");

  async function load() {
    try {
      const data = (await apiFetch("/food-category/")) as Category[];
      setItems(data);
    } catch (err: any) {
      console.error(err);
      toast.error(String(err?.message ?? "Failed to load categories"));
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("Category name is required");
    try {
      await apiFetch("/food-category/", {
        method: "POST",
        body: { categoryName: name },
      });
      setName("");
      toast.success("Category created");
      load();
    } catch (err: any) {
      console.error(err);
      toast.error(String(err?.message ?? "Failed to create category"));
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return;
    try {
      await apiFetch(`/food-category/${id}`, { method: "DELETE" });
      toast.success("Category deleted");
      load();
    } catch (err: any) {
      console.error(err);
      toast.error(String(err?.message ?? "Failed to delete category"));
    }
  }

  return (
    <div>
      <form onSubmit={createCategory} className="mb-4 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 rounded border px-3 py-2"
        />
        <button className="rounded bg-slate-800 px-3 py-2 text-white transition-colors hover:bg-slate-700">
          Create
        </button>
      </form>

      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded border p-2"
          >
            <span>{c.categoryName}</span>
            <div>
              <Link
                className="mr-2 cursor-pointer rounded bg-amber-500 px-2 py-1 text-white transition-colors hover:bg-amber-600"
                href={`/admin/categories/${c.id}`}
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => remove(c.id)}
                className="cursor-pointer rounded bg-red-500 px-2 py-1 text-white transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
