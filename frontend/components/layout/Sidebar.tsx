"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, GraduationCap, X } from "lucide-react";

import {
  sidebarConfig,
  type UserRole,
} from "../navigation/sidebarConfig";

type SidebarUser = {
  name: string;
  role: UserRole;
};

type SidebarProps = {
  user: SidebarUser;
  mobileOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
};

function formatRole(role: UserRole) {
  return role
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export default function Sidebar({
  user,
  mobileOpen = false,
  onClose,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  const navigationItems = sidebarConfig[user.role] ?? [];

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-64 flex-col
          border-r border-[#1E3045]
          bg-[#050B14]
          transition-transform duration-300
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-[#1E3045] px-5">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1683FF]">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="text-sm font-semibold text-[#F8FAFC]">
                CampusConnect
              </h1>

              <p className="text-xs text-[#64748B]">
                Placement Portal
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-[#94A3B8] hover:bg-[#0B1422] hover:text-white lg:hidden"
            aria-label="Close navigation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User */}
        <div className="border-b border-[#1E3045] px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B1422] text-sm font-semibold text-[#1683FF]">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#F8FAFC]">
                {user.name}
              </p>

              <p className="truncate text-xs text-[#94A3B8]">
                {formatRole(user.role)}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            Navigation
          </p>

          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" &&
                  pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center gap-3 rounded-lg px-3 py-2.5
                    text-sm transition-colors
                    ${
                      isActive
                        ? "bg-[#1683FF]/10 text-[#1683FF]"
                        : "text-[#94A3B8] hover:bg-[#0B1422] hover:text-[#F8FAFC]"
                    }
                  `}
                >
                  <Icon
                    className={`
                      h-5 w-5 shrink-0
                      ${
                        isActive
                          ? "text-[#1683FF]"
                          : "text-[#64748B] group-hover:text-[#F8FAFC]"
                      }
                    `}
                  />

                  <span>{item.label}</span>

                  {isActive && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#1683FF]" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="border-t border-[#1E3045] p-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#94A3B8] transition-colors hover:bg-[#EF4444]/10 hover:text-[#EF4444]"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}