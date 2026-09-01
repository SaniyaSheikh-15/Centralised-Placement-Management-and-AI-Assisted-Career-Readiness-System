"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const pageTitles: Record<string, string> = {
  "/profile": "Profile Overview",
  "/profile/edit": "Edit Profile",
  "/profile/skills": "Skills Management",
  "/profile/projects": "Projects",
  "/profile/certifications": "Certifications",
  "/profile/resume": "Resume Upload",
};

export default function TopNavbar() {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || "Student Profile";

  const { user } = useAuth();

  const fullName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : "Student";

  const initials = user
    ? `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase()
    : "ST";

  return (
    <header className="fixed left-[260px] right-0 top-0 z-40 flex h-[60px] items-center justify-between border-b border-[#1A2B42] bg-[#09111E] px-8 max-md:left-0 max-md:px-4">
      {/* Left — Page Title */}
      <div className="flex items-center">
        <h1 className="text-lg font-bold text-[#F1F5F9]">
          {pageTitle}
        </h1>
      </div>

      {/* Right — Search, Notifications, Profile */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="hidden items-center gap-2 rounded-lg border border-[#1A2B42] bg-[#0E1B2E] px-3 py-2 transition-colors focus-within:border-[#1683FF] md:flex">
          <Search className="h-3.5 w-3.5 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full min-w-[160px] border-none bg-transparent text-sm text-[#F1F5F9] outline-none placeholder:text-[#64748B]"
          />
        </div>

        {/* Notifications */}
        <button className="relative text-[#94A3B8] transition-colors hover:text-[#F1F5F9]">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-white/[0.04]">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gradient-to-br from-[#1683FF] to-[#7C5CFC] text-xs font-bold text-white">
            {initials}
          </div>

          <div className="hidden flex-col md:flex">
            <span className="text-sm font-semibold text-[#F1F5F9]">
              {fullName}
            </span>

            <span className="text-xs text-[#64748B]">
              Student
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}