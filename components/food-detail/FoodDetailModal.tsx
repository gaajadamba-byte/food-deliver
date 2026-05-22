"use client";

import { useEffect } from "react";
import { FoodDetailCard } from "./FoodDetailCard";
import type { Food } from "@/lib/types";
import "./FoodDetailModal.css";

interface FoodDetailModalProps {
  food: Food | null;
  onClose: () => void;
}

export function FoodDetailModal({ food, onClose }: FoodDetailModalProps) {
  useEffect(() => {
    if (!food) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [food, onClose]);

  if (!food) return null;

  return (
    <div
      className="food-modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="food-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <FoodDetailCard food={food} onClose={onClose} />
      </div>
    </div>
  );
}
