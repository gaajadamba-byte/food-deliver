"use client";

import React from "react";

export const AdminStatsCard: React.FC<{
  label: string;
  value: number | string;
  tone?: "neutral" | "positive" | "accent";
  icon?: React.ReactNode;
}> = ({ label, value, tone = "neutral", icon }) => {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600 bg-emerald-50"
      : tone === "accent"
        ? "text-amber-600 bg-amber-50"
        : "text-slate-600 bg-slate-50";

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition-all hover:shadow-md">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${toneClass}`}
      >
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-slate-400">{label}</div>
        <div className="text-2xl font-bold text-slate-900">{value}</div>
      </div>
    </div>
  );
};
