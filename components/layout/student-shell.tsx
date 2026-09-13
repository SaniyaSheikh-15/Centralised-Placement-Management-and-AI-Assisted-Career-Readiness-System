"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const navigation = [
  { href: "/student", label: "Dashboard", short: "Dashboard" },
  { href: "/student/placement-drives", label: "Placement Drives", short: "Drives" },
  { href: "/student/eligibility", label: "Eligibility", short: "Eligibility" },
  { href: "/student/applications", label: "Applications", short: "Applications" },
  { href: "/student/profile", label: "Profile", short: "Profile" },
  { href: "/student/resume-analyzer", label: "Resume Analyzer", short: "Resume" },
  { href: "/student/placement-match", label: "Placement Match", short: "Match" },
  { href: "/student/skill-gap", label: "Skill Gap", short: "Skills" },
  { href: "/student/assistant", label: "Assistant", short: "Assistant" },
  { href: "/student/mock-interview", label: "Mock Interview", short: "Interview" }
];

export function StudentShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen text-slate-100">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 lg:grid-cols-[232px_1fr]">
        <aside className="border-b border-slate-800/60 bg-[#07101b]/96 px-3 py-3 lg:min-h-screen lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col gap-4 rounded-[22px] border border-slate-800/60 bg-[#08111f]/92 p-3">
            <div className="flex items-center gap-3 rounded-[18px] border border-slate-800/60 bg-slate-950/40 px-3 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 via-sky-400 to-violet-500 text-xs font-bold text-white">
                CC
              </div>
              <div>
                <p className="text-[13px] font-semibold text-white">CampusConnect</p>
                <p className="text-[10px] text-slate-400">Career Platform</p>
              </div>
            </div>

            <nav className="grid gap-1">
              {navigation.map((item) => {
                const active = item.href === "/student" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={[
                      "group flex items-center gap-3 rounded-[8px] border px-3 py-2.5 text-[13px] font-medium transition",
                      active
                        ? "border-sky-400/40 bg-sky-500/15 text-white shadow-[inset_3px_0_0_#38bdf8,0_8px_24px_rgba(22,131,255,0.12)]"
                        : "border-transparent text-slate-400 hover:border-slate-700/60 hover:bg-slate-950/45 hover:text-white"
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "h-2.5 w-2.5 rounded-full transition",
                        active ? "bg-sky-400 shadow-[0_0_0_4px_rgba(22,131,255,0.14)]" : "bg-slate-600 group-hover:bg-slate-400"
                      ].join(" ")}
                    />
                    <span>{item.short}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto rounded-[18px] border border-slate-800/60 bg-slate-950/45 p-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">AP</div>
                <div>
                  <p className="text-[13px] font-semibold text-white">Aafreen Khan</p>
                  <p className="text-[10px] text-slate-400">Student</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="border-b border-slate-800/60 bg-[#07101b]/90 px-4 py-3 backdrop-blur lg:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Student Dashboard</p>
              </div>

              <div className="flex flex-1 items-center justify-end gap-3 lg:max-w-[680px]">
                <div className="hidden w-full max-w-[290px] items-center gap-2 rounded-[18px] border border-slate-800/60 bg-slate-950/50 px-4 py-2 text-[13px] text-slate-400 md:flex">
                  <span className="text-slate-500">⌕</span>
                  <input
                    aria-label="Search"
                    placeholder="Search..."
                    className="w-full border-0 bg-transparent p-0 text-[13px] text-white outline-none placeholder:text-slate-600"
                  />
                </div>

                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-slate-800/60 bg-slate-950/45 text-slate-300"
                >
                  <span className="text-sm">🔔</span>
                  <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-[#07101b]" />
                </button>

                <div className="flex items-center gap-3 rounded-full border border-slate-800/60 bg-slate-950/45 px-2 py-1.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500 text-xs font-bold text-white">AP</div>
                  <div className="pr-2 leading-tight">
                    <p className="text-[13px] font-semibold text-white">Arjun Patil</p>
                    <p className="text-[10px] text-slate-400">Student</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
