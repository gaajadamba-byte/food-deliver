"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const AdminNav: React.FC = () => {
  const pathname = usePathname() || "";
  const isActive = (p: string) => pathname.startsWith(p);

  const items = [
    { href: "/admin", label: "Нүүр" },
    { href: "/admin/categories", label: "Ангилалууд" },
    { href: "/admin/foods", label: "Хоолнууд" },
    { href: "/admin/orders", label: "Захиалгууд" },
  ];

  return (
    <nav className="rounded-lg bg-white p-4 shadow">
      <ul className="space-y-2">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className={`block rounded px-2 py-1 hover:bg-slate-50 ${isActive(it.href) ? "bg-slate-50 font-medium" : ""}`}
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminNav;
