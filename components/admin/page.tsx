import React from "react";
import { UserManager } from "@/components/admin/UserManager";

export default function AdminUsersPage() {
  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">Хэрэглэгчид</h2>
      <UserManager />
    </div>
  );
}
