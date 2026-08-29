'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Pencil,
  FileText,
  Code2,
  FolderKanban,
  Award,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { label: 'STUDENT PROFILE', section: true },
  { href: '/profile', label: 'Profile Overview', icon: LayoutDashboard },
  { href: '/profile/edit', label: 'Edit Profile', icon: Pencil },
  { href: '/profile/resume', label: 'Resume', icon: FileText },
  { href: '/profile/skills', label: 'Skills', icon: Code2 },
  { href: '/profile/projects', label: 'Projects', icon: FolderKanban },
  { href: '/profile/certifications', label: 'Certifications', icon: Award },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 flex w-[260px] flex-col border-r border-[#1A2B42] bg-[#09111E] max-md:hidden">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-[#1A2B42] px-5 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1683FF] to-[#7C5CFC] text-sm font-extrabold text-white">
          CC
        </div>
        <div>
          <div className="text-base font-bold text-[#F1F5F9]">CampusConnect</div>
          <div className="text-xs text-[#64748B]">Profile Builder</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {navItems.map((item, idx) => {
          if (item.section) {
            return (
              <div
                key={idx}
                className="mb-1 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]"
              >
                {item.label}
              </div>
            );
          }

          const isActive = pathname === item.href;
          const Icon = item.icon!;

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={`flex items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'border-[rgba(22,131,255,0.15)] bg-[rgba(22,131,255,0.10)] text-[#1683FF]'
                  : 'text-[#94A3B8] hover:bg-white/[0.04] hover:text-[#F1F5F9]'
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile Badge */}
      <div className="flex items-center gap-3 border-t border-[#1A2B42] px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1683FF] to-[#7C5CFC] text-xs font-bold text-white">
          AP
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[#F1F5F9]">Arjun Patil</div>
          <div className="text-xs text-[#64748B]">Student</div>
        </div>
        <ChevronRight className="h-4 w-4 text-[#64748B]" />
      </div>
    </aside>
  );
}
