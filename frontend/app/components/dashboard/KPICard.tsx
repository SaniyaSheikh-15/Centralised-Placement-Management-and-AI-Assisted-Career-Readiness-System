"use client";

import type { ElementType } from "react";

type KPICardProps = {
  title: string;
  value: string | number | null;
  description: string;
  icon: ElementType;
};

export default function KPICard({
  title,
  value,
  description,
  icon: Icon,
}: KPICardProps) {
  return (
    <div
      className="
        rounded-xl border border-[#1E3045]
        bg-[#101C2C] p-5
        transition hover:border-[#1683FF]/50
      "
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#1683FF]/10">
        <Icon className="h-5 w-5 text-[#1683FF]" />
      </div>

      <p className="mt-5 text-sm text-slate-400">
        {title}
      </p>

      <div className="mt-1 min-h-[36px] text-2xl font-bold text-white">
        {value !== null && value !== undefined && value !== ""
          ? value
          : "—"}
      </div>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}