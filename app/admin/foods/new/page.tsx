"use client";

import React from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { FoodForm } from "@/components/admin/FoodForm";

export default function NewFoodPage() {
  return (
    <AdminGuard>
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">Add Food</h1>
        <div className="rounded-lg bg-white p-6 shadow">
          <FoodForm />
        </div>
      </div>
    </AdminGuard>
  );
}
