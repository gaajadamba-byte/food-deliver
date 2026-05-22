import { FoodCard } from "./FoodCard";
import type { Food } from "@/lib/types";

interface FoodSectionProps {
  title: string;
  foods: Food[];
}

export function FoodSection({ title, foods }: FoodSectionProps) {
  return (
    <section className="py-6">
      <h2 className="mb-4 text-xl font-bold text-gray-900">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {foods.map((food) => (
          <FoodCard key={food.id} food={food} />
        ))}
      </div>
    </section>
  );
}
