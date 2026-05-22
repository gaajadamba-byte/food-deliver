"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import type { CartItem } from "@/lib/types";

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { setQuantity, removeItem } = useCart();
  const { food, quantity } = item;

  return (
    <div className="flex gap-3 py-3">
      {/* Thumbnail */}
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
        {food.image ? (
          <Image
            src={food.image}
            alt={food.foodName}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : null}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-semibold text-[#e8432d] leading-tight">
            {food.foodName}
          </span>
          <button
            onClick={() => removeItem(food.id)}
            aria-label={`${food.foodName} устгах`}
            className="shrink-0 text-gray-300 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="line-clamp-1 text-xs text-gray-400">{food.ingredients}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-gray-800">
            {formatPrice(food.price * quantity)}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity(food.id, quantity - 1)}
              aria-label="Тоо хасах"
              className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-5 text-center text-sm font-medium text-gray-800">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(food.id, quantity + 1)}
              aria-label="Тоо нэмэх"
              className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e8432d] text-white hover:bg-[#d03a26] transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
