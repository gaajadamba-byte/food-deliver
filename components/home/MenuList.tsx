"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { Food, FoodCategory } from "@/lib/types";
import { FoodSection } from "./FoodSection";

interface MenuState {
  categories: FoodCategory[];
  foods: Food[];
}

function MenuSkeleton() {
  return (
    <div className="space-y-8 py-6">
      {[0, 1].map((section) => (
        <div key={section}>
          <Skeleton className="mb-4 h-6 w-40" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((card) => (
              <Skeleton key={card} className="h-60 rounded-2xl" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function MenuList() {
  const [data, setData] = useState<MenuState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    Promise.all([
      apiFetch<FoodCategory[]>("/food-category", { auth: false }),
      apiFetch<Food[]>("/food", { auth: false }),
    ])
      .then(([categories, foods]) => {
        if (active) setData({ categories, foods });
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Цэс ачаалахад алдаа гарлаа");
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <p className="py-12 text-center text-sm text-gray-500">
        Цэс ачаалахад алдаа гарлаа: {error}
      </p>
    );
  }

  if (!data) {
    return <MenuSkeleton />;
  }

  // Group foods under their category, hiding categories with no foods.
  const sections = data.categories
    .map((category) => ({
      category,
      foods: data.foods.filter((food) => food.categoryId === category.id),
    }))
    .filter((section) => section.foods.length > 0);

  if (sections.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-gray-500">
        Одоогоор хоол нэмэгдээгүй байна.
      </p>
    );
  }

  return (
    <>
      {sections.map(({ category, foods }) => (
        <FoodSection key={category.id} title={category.categoryName} foods={foods} />
      ))}
    </>
  );
}
