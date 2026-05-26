"use client";

import React from "react";

export const AdminHeader: React.FC<{ title?: string }> = ({
  title = "Admin Dashboard",
}) => {
  return (
    <header className="mb-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <div className="hidden items-center gap-2 rounded-md bg-slate-100 px-3 py-1 text-sm text-slate-600 md:flex">
          <svg
            className="h-4 w-4 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden
          >
            <path
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35"
            />
            <circle
              cx="11"
              cy="11"
              r="6"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            aria-label="Search"
            className="w-64 bg-transparent text-sm outline-none"
            placeholder="Хоол, захиалга хайх..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="hidden rounded-md bg-slate-800 px-3 py-2 text-sm text-white md:inline-block">
          New
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm font-medium">Админ</div>
            <div className="text-xs text-slate-500">admin@food.app</div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-slate-300 to-slate-200 text-sm font-semibold text-slate-700">
            A
          </div>
        </div>
      </div>
    </header>
  );
};
