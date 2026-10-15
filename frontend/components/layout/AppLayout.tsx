"use client";

import { ReactNode, useState } from "react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import type { UserRole } from "../navigation/sidebarConfig";

export type AppUser = {
  name: string;
  role: UserRole;
};

type AppLayoutProps = {
  children: ReactNode;
  user: AppUser;
  onLogout?: () => void;
};

export default function AppLayout({
  children,
  user,
  onLogout,
}: AppLayoutProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050B14] text-[#F8FAFC]">
      <Sidebar
        user={user}
        mobileOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onLogout={onLogout}
      />

      <Navbar
        user={user}
        onMenuClick={() => setMobileSidebarOpen(true)}
        onLogout={onLogout}
      />

      <main className="min-h-screen pt-16 lg:pl-64">
        <div className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}