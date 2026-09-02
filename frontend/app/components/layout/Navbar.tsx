"use client";

import {
  Bell,
  LogOut,
  Menu,
  Search,
  UserRound,
} from "lucide-react";

import { useState } from "react";

import type { UserRole } from "../navigation/sidebarConfig";

/* =========================================================
   TYPES
========================================================= */

type NavbarUser = {
  name: string;
  role: UserRole;
};

type NavbarProps = {
  user: NavbarUser;
  onMenuClick?: () => void;
  onLogout?: () => void;
};

/* =========================================================
   ROLE FORMATTER
========================================================= */

function formatRole(role: UserRole) {
  return role
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

/* =========================================================
   NAVBAR
========================================================= */

export default function Navbar({
  user,
  onMenuClick,
  onLogout,
}: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header
      className="
        fixed inset-x-0 top-0 z-30 h-16
        border-b border-[#1E3045]
        bg-[#050B14]/95
        backdrop-blur
        lg:left-64
      "
    >
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="flex min-w-0 items-center gap-3">

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={onMenuClick}
            className="
              rounded-lg p-2
              text-[#94A3B8]
              hover:bg-[#0B1422]
              hover:text-white
              lg:hidden
            "
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="relative hidden w-full max-w-md sm:block">
            <Search
              className="
                absolute left-3 top-1/2
                h-4 w-4
                -translate-y-1/2
                text-[#64748B]
              "
            />

            <input
              type="search"
              placeholder="Search..."
              className="
                h-10 w-full
                rounded-lg
                border border-[#1E3045]
                bg-[#0B1422]
                pl-10 pr-4
                text-sm text-[#F8FAFC]
                outline-none
                placeholder:text-[#64748B]
                focus:border-[#1683FF]
              "
            />
          </div>

          {/* Mobile search */}
          <button
            type="button"
            className="
              rounded-lg p-2
              text-[#94A3B8]
              hover:bg-[#0B1422]
              hover:text-white
              sm:hidden
            "
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="flex items-center gap-2">

          {/* Notifications */}
          <button
            type="button"
            className="
              relative rounded-lg p-2.5
              text-[#94A3B8]
              hover:bg-[#0B1422]
              hover:text-white
            "
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />

            {/* Notification indicator */}
            <span
              className="
                absolute right-2 top-2
                h-2 w-2
                rounded-full
                bg-[#1683FF]
              "
            />
          </button>

          {/* Divider */}
          <div className="mx-1 hidden h-7 w-px bg-[#1E3045] sm:block" />

          {/* =================================================
              USER PROFILE
          ================================================= */}

          <div className="relative">

            <button
              type="button"
              onClick={() => setProfileOpen((value) => !value)}
              className="
                flex items-center gap-3
                rounded-lg
                px-2 py-1.5
                hover:bg-[#0B1422]
              "
              aria-expanded={profileOpen}
              aria-label="Open profile menu"
            >

              {/* Avatar */}
              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-full
                  bg-[#0B1422]
                  text-[#1683FF]
                "
              >
                <UserRound className="h-5 w-5" />
              </div>

              {/* User name + role */}
              <div className="hidden text-left md:block">
                <p
                  className="
                    max-w-32 truncate
                    text-sm font-medium
                    text-[#F8FAFC]
                  "
                >
                  {user.name}
                </p>

                <p className="text-xs text-[#94A3B8]">
                  {formatRole(user.role)}
                </p>
              </div>
            </button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================= */}

            {profileOpen && (
              <div
                className="
                  absolute right-0 top-12
                  w-64
                  overflow-hidden
                  rounded-xl
                  border border-[#1E3045]
                  bg-[#0B1422]
                  shadow-xl
                "
              >

                {/* User information */}
                <div className="border-b border-[#1E3045] px-4 py-3">
                  <p
                    className="
                      truncate
                      text-sm font-medium
                      text-[#F8FAFC]
                    "
                  >
                    {user.name}
                  </p>

                  <p className="mt-1 text-xs text-[#94A3B8]">
                    {formatRole(user.role)}
                  </p>
                </div>

                {/* Logout inside dropdown */}
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    onLogout?.();
                  }}
                  className="
                    flex w-full items-center gap-3
                    px-4 py-3
                    text-sm
                    text-[#EF4444]
                    transition
                    hover:bg-[#EF4444]/10
                  "
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* =================================================
              TOP NAVBAR LOGOUT
          ================================================= */}

          <button
            type="button"
            onClick={onLogout}
            className="
              hidden sm:flex
              items-center gap-2
              rounded-lg
              border border-[#1E3045]
              px-3 py-2
              text-sm font-medium
              text-[#94A3B8]
              transition
              hover:border-[#EF4444]/50
              hover:bg-[#EF4444]/10
              hover:text-[#EF4444]
            "
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}