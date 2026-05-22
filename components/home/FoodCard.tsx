"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { useFoodDetail } from "@/context/food-detail-context";
import { formatPrice } from "@/lib/format";
import type { Food } from "@/lib/types";

interface FoodCardProps {
  food: Food;
}

export function FoodCard({ food }: FoodCardProps) {
  const { addItem } = useCart();
  const { openFood } = useFoodDetail();

  function handleAdd(event: React.MouseEvent) {
    // Keep the quick-add button from also opening the detail modal.
    event.stopPropagation();
    addItem(food);
    toast.success(`${food.foodName} сагсанд нэмэгдлээ`);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => openFood(food)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openFood(food);
        }
      }}
      className="cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Image area */}
      <div className="relative h-40 w-full bg-gray-100">
        {food.image ? (
          <Image
            src={food.image}
            alt={food.foodName}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 360px"
          />
        ) : null}
        <button
          onClick={handleAdd}
          aria-label={`${food.foodName} сагсанд нэмэх`}
          className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50 active:scale-95 transition-transform"
        >
          <Plus className="h-4 w-4 text-gray-700" />
        </button>
      </div>

      {/* Info area */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-[#e8432d] leading-tight">
            {food.foodName}
          </span>
          <span className="shrink-0 text-sm font-semibold text-gray-800">
            {formatPrice(food.price)}
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-400 line-clamp-2 leading-relaxed">
          {food.ingredients}
        </p>
      </div>
    </div>
  );
}
