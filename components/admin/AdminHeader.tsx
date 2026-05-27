"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { LogOut, Search, Bell } from "lucide-react";

export const AdminHeader: React.FC<{ title?: string }> = ({
  title = "Admin Dashboard",
}) => {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 mb-8 flex items-center justify-between gap-4 rounded-2xl bg-white/80 px-6 py-4 shadow-sm ring-1 ring-slate-200 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          {title}
        </h1>
        <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 ring-1 ring-slate-200 focus-within:ring-slate-400 md:flex transition-all">
          <Search size={16} className="text-slate-400" />
          <input
            aria-label="Search"
            className="w-64 bg-transparent text-sm outline-none"
            placeholder="Хайх..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-xl p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600">
          <Bell size={20} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex cursor-pointer items-center gap-3 rounded-xl p-1 pr-2 transition-all hover:bg-slate-50"
          >
            <div className="hidden text-right md:block">
              <div className="text-sm font-medium">
                {user?.email?.split("@")[0] || "Админ"}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400">
                {user?.email || "admin@food.app"}
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-slate-300 to-slate-200 text-sm font-semibold text-slate-700">
              {user?.email?.[0].toUpperCase() || "A"}
            </div>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 z-50">
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                Системээс гарах
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
