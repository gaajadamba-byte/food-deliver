"use client";

import React, { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { FoodCategoryManager } from "@/components/admin/FoodCategoryManager";
import { FoodManager } from "@/components/admin/FoodManager";
import { OrdersManager } from "@/components/admin/OrdersManager";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import DashboardStats from "@/components/admin/DashboardStats";

export default function AdminPage() {
  return (
    <AdminGuard>
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="flex gap-6">
          <aside className="w-64">
            <div className="sticky top-6">
              <AdminNav />
            </div>
          </aside>

          <main className="flex-1">
            <AdminHeader />

            <DashboardStats />

            <section className="space-y-6">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <h2 className="mb-4 text-lg font-bold text-slate-900">
                    Categories
                  </h2>
                  <FoodCategoryManager />
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <h2 className="mb-4 text-lg font-bold text-slate-900">
                    Foods
                  </h2>
                  <FoodManager />
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="mb-4 text-lg font-bold text-slate-900">
                  Recent Orders
                </h2>
                <OrdersManager />
              </div>
            </section>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
