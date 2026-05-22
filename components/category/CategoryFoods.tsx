"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { FoodCard } from "@/components/home/FoodCard";
import type { Food, FoodCategory } from "@/lib/types";

interface CategoryFoodsProps {
  categoryId: string;
}

export function CategoryFoods({ categoryId }: CategoryFoodsProps) {
  const [foods, setFoods] = useState<Food[] | null>(null);
  const [category, setCategory] = useState<FoodCategory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      apiFetch<Food[]>(`/food/${categoryId}`, { auth: false }),
      apiFetch<FoodCategory[]>("/food-category", { auth: false }),
    ])
      .then(([categoryFoods, categories]) => {
        if (!active) return;
        setFoods(categoryFoods);
        setCategory(categories.find((c) => c.id === categoryId) ?? null);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Алдаа гарлаа");
        }
      });

    return () => {
      active = false;
    };
  }, [categoryId]);

  if (error) {
    return (
      <p className="py-12 text-center text-sm text-gray-500">
        Хоол ачаалахад алдаа гарлаа: {error}
      </p>
    );
  }

  if (!foods) {
    return (
      <div>
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3, 4, 5, 6, 7].map((card) => (
            <Skeleton key={card} className="h-60 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        {category?.categoryName ?? "Цэс"}
      </h1>

      {foods.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-500">
          Энэ ангилалд хоол алга байна.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {foods.map((food) => (
            <FoodCard key={food.id} food={food} />
          ))}
        </div>
      )}
    </section>
  );
}
