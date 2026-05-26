"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

export default function EditCategoryPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const list = (await apiFetch("/food-category/")) as any[];
        const found = list.find((c) => c.id === id);
        if (!found) {
          toast.error("Category not found");
          router.push("/admin/categories");
          return;
        }
        setName(found.categoryName);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load category");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    try {
      await apiFetch(`/food-category/${id}`, {
        method: "PATCH",
        body: { categoryName: name },
      });
      toast.success("Category updated");
      router.push("/admin/categories");
    } catch (err: any) {
      console.error(err);
      toast.error(String(err?.message ?? "Failed to update"));
    }
  }

  if (!id) return <div className="p-6">Missing category id</div>;

  return (
    <AdminGuard>
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="mb-4 text-2xl font-semibold">Edit Category</h1>
        <div className="rounded-lg bg-white p-6 shadow">
          {loading ? (
            <div>Loading…</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded border px-3 py-2"
                />
              </div>
              <div>
                <button className="rounded bg-slate-800 px-4 py-2 text-white">
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}
