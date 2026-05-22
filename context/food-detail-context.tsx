"use client";

import { createContext, useContext, useState } from "react";
import { FoodDetailModal } from "@/components/food-detail/FoodDetailModal";
import type { Food } from "@/lib/types";

interface FoodDetailContextValue {
  /** Opens the food detail modal for the given food. */
  openFood: (food: Food) => void;
  /** Closes the food detail modal. */
  closeFood: () => void;
}

const FoodDetailContext = createContext<FoodDetailContextValue | null>(null);

export function FoodDetailProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);

  return (
    <FoodDetailContext.Provider
      value={{
        openFood: setSelectedFood,
        closeFood: () => setSelectedFood(null),
      }}
    >
      {children}
      <FoodDetailModal
        food={selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </FoodDetailContext.Provider>
  );
}

export function useFoodDetail(): FoodDetailContextValue {
  const context = useContext(FoodDetailContext);
  if (!context) {
    throw new Error("useFoodDetail must be used within a FoodDetailProvider");
  }
  return context;
}
