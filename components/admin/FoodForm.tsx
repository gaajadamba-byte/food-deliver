"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

type Category = { id: string; categoryName: string };
type FoodData = {
  id?: string;
  foodName: string;
  price: number;
  image?: string;
  ingredients?: string;
  categoryId?: string;
};

export const FoodForm: React.FC<{
  initial?: FoodData | null;
}> = ({ initial = null }) => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [foodName, setFoodName] = useState(initial?.foodName ?? "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [ingredients, setIngredients] = useState(initial?.ingredients ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initial?.image ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = (await apiFetch("/food-category/")) as Category[];
        setCategories(data);
        if (!categoryId && data.length) setCategoryId(data[0].id);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function uploadFile(): Promise<string | null> {
    if (!file) return imageUrl || preview || null;
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    // apiFetch supports FormData
    const res = (await apiFetch<{ url: string; publicId?: string }>(
      "/upload/",
      {
        method: "POST",
        body: fd,
      },
    )) as { url: string };
    setUploading(false);
    return res?.url ?? null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = await uploadFile();
      const payload = {
        foodName,
        price: Number(price),
        ingredients,
        image: url,
        categoryId,
      };
      if (initial?.id) {
        await apiFetch(`/food/${initial.id}`, {
          method: "PATCH",
          body: payload,
        });
      } else {
        await apiFetch(`/food/`, { method: "POST", body: payload });
      }
      toast.success("Saved");
      router.push("/admin/foods");
    } catch (err) {
      console.error(err);
      toast.error(String((err as any)?.message ?? "Save failed"));
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          required
          value={foodName}
          onChange={(e) => setFoodName(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Price</label>
        <input
          required
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="mt-1 w-48 rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Ingredients</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Image</label>
        <div className="mt-1 flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="h-20 w-20 object-cover"
            />
          ) : null}
          {uploading ? (
            <div className="text-sm text-slate-500">Uploading...</div>
          ) : null}
        </div>
      </div>

      <div>
        <button
          disabled={saving}
          className="rounded bg-slate-800 px-4 py-2 text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
};
