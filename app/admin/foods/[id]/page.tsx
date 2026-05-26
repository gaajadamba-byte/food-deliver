"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { FoodForm } from "@/components/admin/FoodForm";
import { apiFetch } from "@/lib/api";

export default function EditFoodPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const [initial, setInitial] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        // Backend doesn't expose GET /food/:foodId — load all and find.
        const list = (await apiFetch("/food/")) as any[];
        const found = list.find((f) => f.id === id);
        if (!found) {
          router.push("/admin/foods");
          return;
        }
        setInitial(found);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id, router]);

  if (!id) return <div className="p-6">Missing id</div>;

  return (
    <AdminGuard>
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">Edit Food</h1>
        <div className="rounded-lg bg-white p-6 shadow">
          {initial ? <FoodForm initial={initial} /> : <div>Loading…</div>}
        </div>
      </div>
    </AdminGuard>
  );
}
