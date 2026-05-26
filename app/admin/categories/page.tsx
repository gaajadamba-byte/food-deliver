"use client";

import React from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { FoodCategoryManager } from "@/components/admin/FoodCategoryManager";
import { AdminGuard } from "@/components/admin/AdminGuard";

export default function CategoriesPage() {
  return (
    <AdminGuard>
      <div className="mx-auto max-w-7xl p-6">
        <div className="flex gap-6">
          <aside className="w-64">
            <AdminNav />
          </aside>
          <main className="flex-1">
            <h1 className="mb-4 text-2xl font-semibold">Manage Categories</h1>
            <div className="rounded-lg bg-white p-4 shadow">
              <FoodCategoryManager />
            </div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
