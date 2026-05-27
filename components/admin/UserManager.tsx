"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  role: "USER" | "ADMIN"; // Based on UserRole enum in schema.prisma
  isVerified: boolean;
  createdAt: string;
};

export const UserManager: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  async function loadUsers() {
    try {
      // Assuming an admin-only endpoint to fetch all users
      // You will need to implement GET /users in your backend for this to work
      const data = (await apiFetch("/users/")) as User[];
      setUsers(data);
    } catch (err: any) {
      console.error(err);
      toast.error(String(err?.message ?? "Хэрэглэгчдийг татахад алдаа гарлаа"));
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function removeUser(id: string) {
    if (!confirm("Энэ хэрэглэгчийг устгах уу?")) return;
    try {
      // Assuming an admin-only endpoint to delete a user
      // You will need to implement DELETE /users/:id in your backend for this to work
      await apiFetch(`/users/${id}`, { method: "DELETE" });
      toast.success("Хэрэглэгч устгагдлаа");
      loadUsers();
    } catch (err: any) {
      console.error(err);
      toast.error(String(err?.message ?? "Хэрэглэгчийг устгахад алдаа гарлаа"));
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Нийт хэрэглэгч: {users.length}
        </div>
        {/* Placeholder for Add User link/button. You'll need to create a UserForm component and a new page for this. */}
        <Link
          className="rounded bg-slate-800 px-3 py-2 text-white transition-colors hover:bg-slate-700"
          href="/admin/users/new" // Assuming a new page for adding/editing users
        >
          Хэрэглэгч нэмэх
        </Link>
      </div>

      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between rounded border bg-white p-3"
          >
            <div>
              <div className="font-medium">{user.email}</div>
              <div className="text-sm text-slate-500">Үүрэг: {user.role}</div>
              <div className="text-sm text-slate-500">
                Бүртгүүлсэн: {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div>
              {/* Edit button - placeholder for now. You'll need to create a UserForm component and a new page for this. */}
              <Link
                className="mr-2 cursor-pointer rounded bg-amber-500 px-2 py-1 text-white transition-colors hover:bg-amber-600"
                href={`/admin/users/${user.id}`}
              >
                Засах
              </Link>
              <button
                type="button"
                onClick={() => removeUser(user.id)}
                className="cursor-pointer rounded bg-red-500 px-2 py-1 text-white transition-colors hover:bg-red-600"
              >
                Устгах
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
