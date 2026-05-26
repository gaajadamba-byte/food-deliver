"use client";

import React from "react";

export const AdminStatsCard: React.FC<{
  label: string;
  value: number | string;
  tone?: "neutral" | "positive" | "accent";
}> = ({ label, value, tone = "neutral" }) => {
  const toneClass =
    tone === "positive"
      ? "from-emerald-50 to-emerald-100 text-emerald-700"
      : tone === "accent"
        ? "from-amber-50 to-amber-100 text-amber-700"
        : "from-slate-50 to-slate-100 text-slate-800";

  return (
    <div className={`rounded-lg p-4 shadow-sm bg-linear-to-br ${toneClass}`}>
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold leading-tight">{value}</div>
    </div>
  );
};
