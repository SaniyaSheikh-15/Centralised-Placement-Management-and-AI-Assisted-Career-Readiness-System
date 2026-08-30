"use client";

import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function ChartCard({
  title,
  description,
  children,
}: ChartCardProps) {
  return (
    <div className="rounded-xl border border-[#1E3045] bg-[#101C2C] p-5">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-white">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}