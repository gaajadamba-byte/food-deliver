"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/format";
import type { Food } from "@/lib/types";
import "./FoodDetailCard.css";

interface FoodDetailCardProps {
  food: Food;
  onClose: () => void;
}

export function FoodDetailCard({ food, onClose }: FoodDetailCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity((q) => q + 1);
  }

  function handleAddToCart() {
    addItem(food, quantity);
    toast.success(`${food.foodName} сагсанд нэмэгдлээ`);
    onClose();
  }

  const totalPrice = food.price * quantity;

  return (
    <div className="food-detail-card">
      {/* Food image */}
      <div className="food-detail-image-wrapper">
        {food.image ? (
          <Image
            src={food.image}
            alt={food.foodName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 390px"
          />
        ) : (
          <div className="food-detail-image-placeholder" />
        )}
      </div>

      {/* Info panel */}
      <div className="food-detail-info">
        {/* Close button */}
        <div className="food-detail-close-row">
          <button
            onClick={onClose}
            aria-label="Close"
            className="food-detail-close-btn"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Name + description */}
        <div className="food-detail-text">
          <h2 className="food-detail-name">{food.foodName}</h2>
          <p className="food-detail-description">{food.ingredients}</p>
        </div>

        {/* Price + quantity + CTA */}
        <div className="food-detail-price-section">
          <div className="food-detail-price-row">
            <div className="food-detail-price-info">
              <span className="food-detail-price-label">Total price</span>
              <span className="food-detail-price-value">
                {formatPrice(totalPrice)}
              </span>
            </div>

            <div className="food-detail-quantity">
              <button
                onClick={decrement}
                aria-label="Decrease quantity"
                className="food-detail-qty-btn food-detail-qty-btn--outline"
              >
                <Minus size={16} strokeWidth={1.5} />
              </button>
              <span className="food-detail-qty-value">{quantity}</span>
              <button
                onClick={increment}
                aria-label="Increase quantity"
                className="food-detail-qty-btn food-detail-qty-btn--filled"
              >
                <Plus size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="food-detail-add-btn"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
