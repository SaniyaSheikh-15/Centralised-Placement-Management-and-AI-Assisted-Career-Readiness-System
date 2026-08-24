"use client";

import {
  Bell,
  Search,
  UserRound,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 h-16 border-b border-[#1E3045] bg-[#050B14]/95 backdrop-blur lg:left-64">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />

          <input
            type="search"
            placeholder="Search..."
            className="h-9 w-full rounded-lg border border-[#1E3045] bg-[#0B1422] pl-9 pr-3 text-sm text-[#F8FAFC] outline-none placeholder:text-[#64748B] focus:border-[#1683FF]"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[#1E3045] bg-[#0B1422] text-[#94A3B8] transition hover:border-[#1683FF]/50 hover:text-[#F8FAFC]"
          >
            <Bell className="h-4 w-4" />
          </button>

          <div className="hidden h-8 w-px bg-[#1E3045] sm:block" />

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1E3045] bg-[#101C2C]">
              <UserRound className="h-4 w-4 text-[#94A3B8]" />
            </div>

            <div className="hidden sm:block">
              <p className="text-xs font-medium text-[#F8FAFC]">
                Placement Officer
              </p>

              <p className="text-[10px] text-[#64748B]">
                T&P
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}