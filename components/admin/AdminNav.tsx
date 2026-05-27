"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Utensils, Tags, ClipboardList } from "lucide-react";

export const AdminNav: React.FC = () => {
  const pathname = usePathname() || "";
  const isActive = (p: string) =>
    p === "/admin" ? pathname === p : pathname.startsWith(p);

  const items = [
    { href: "/admin", label: "Хянах самбар", icon: LayoutDashboard },
    { href: "/admin/categories", label: "Ангилал", icon: Tags },
    { href: "/admin/foods", label: "Хоолны цэс", icon: Utensils },
    { href: "/admin/orders", label: "Захиалга", icon: ClipboardList },
  ];

  return (
    <nav className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <div className="mb-6 px-2 py-1">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Цэс
        </span>
      </div>
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive(it.href)
                  ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <it.icon size={18} strokeWidth={isActive(it.href) ? 2.5 : 2} />
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default AdminNav;
