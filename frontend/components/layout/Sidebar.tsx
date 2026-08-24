"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BriefcaseBusiness,
  FileText,
  Building2,
  BarChart3,
  TrendingUp,
  ClipboardList,
  Settings,
  X,
} from "lucide-react";

type SidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

const navigation = [
  {
    title: "Overview",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },

  {
    title: "Students",
    items: [
      {
        name: "All Students",
        href: "/students",
        icon: Users,
      },
      {
        name: "Eligible Students",
        href: "/eligible-students",
        icon: GraduationCap,
      },
    ],
  },

  {
    title: "Recruitment",
    items: [
      {
        name: "Placement Drives",
        href: "/placement-drives",
        icon: BriefcaseBusiness,
      },
      {
        name: "Applications",
        href: "/applications",
        icon: FileText,
      },
      {
        name: "Companies",
        href: "/companies",
        icon: Building2,
      },
    ],
  },

  {
    title: "Analytics",
    items: [
      {
        name: "Placement Analytics",
        href: "/analytics",
        icon: BarChart3,
      },
      {
        name: "Hiring Trends",
        href: "/hiring-trends",
        icon: TrendingUp,
      },
    ],
  },

  {
    title: "Management",
    items: [
      {
        name: "Reports",
        href: "/reports",
        icon: ClipboardList,
      },
      {
        name: "Settings",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

export default function Sidebar({
  mobileOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-64 flex-col
          border-r border-[#1E3045]
          bg-[#0B1422]
          transition-transform duration-300
          lg:translate-x-0
          ${
            mobileOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* BRAND */}
        <div className="flex h-16 items-center justify-between border-b border-[#1E3045] px-5">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1683FF]">
              <BriefcaseBusiness className="h-5 w-5 text-white" />
            </div>

            <div>
              <p className="text-sm font-semibold text-white">
                Placement
              </p>

              <p className="text-xs text-slate-500">
                Management
              </p>
            </div>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-[#101C2C] hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {navigation.map((section) => (
            <div key={section.title} className="mb-6">
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
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
                        group flex items-center gap-3 rounded-lg
                        px-3 py-2.5 text-sm
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-[#1683FF]/10 text-[#1683FF]"
                            : "text-slate-400 hover:bg-[#101C2C] hover:text-white"
                        }
                      `}
                    >
                      <Icon
                        className={`
                          h-[18px] w-[18px]
                          ${
                            isActive
                              ? "text-[#1683FF]"
                              : "text-slate-500 group-hover:text-slate-300"
                          }
                        `}
                      />

                      <span>{item.name}</span>

                      {isActive && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#1683FF]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* USER */}
        <div className="border-t border-[#1E3045] p-4">
          <div className="flex items-center gap-3 rounded-lg bg-[#101C2C] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1683FF]/15 text-sm font-semibold text-[#1683FF]">
              PO
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                Placement Officer
              </p>

              <p className="truncate text-xs text-slate-500">
                Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}