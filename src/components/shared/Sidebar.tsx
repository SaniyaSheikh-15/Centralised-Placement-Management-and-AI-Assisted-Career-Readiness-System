'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Award,
  FileText,
  LayoutDashboard,
  Pencil,
  Code2,
} from 'lucide-react';

const navItems = [
  { label: 'OVERVIEW', section: true },
  { href: '/profile', label: 'Dashboard', icon: LayoutDashboard },
  { label: 'MANAGE', section: true },
  { href: '/profile/edit', label: 'Edit Profile', icon: Pencil },
  { href: '/profile/skills', label: 'Skills', icon: Code2 },
  { href: '/profile/projects', label: 'Projects', icon: FolderKanban },
  { href: '/profile/certifications', label: 'Certifications', icon: Award },
  { href: '/profile/resume', label: 'Resume', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 flex w-[260px] flex-col border-r border-[var(--border-card)] bg-[var(--bg-secondary)] max-md:hidden">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-[var(--border-card)] px-5 py-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-sm font-extrabold text-white">
          CC
        </div>
        <div>
          <div className="text-base font-bold text-[var(--text-primary)]">CampusConnect</div>
          <div className="text-xs text-[var(--text-muted)]">Profile Builder</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
        {navItems.map((item, idx) => {
          if (item.section) {
            return (
              <div
                key={idx}
                className="mb-1 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]"
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
              className={`flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'border-[rgba(22,131,255,0.15)] bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)]'
                  : 'text-[var(--text-secondary)] hover:bg-white/[0.04] hover:text-[var(--text-primary)]'
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex items-center gap-3 border-t border-[var(--border-card)] px-5 py-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-xs font-bold text-white">
          AP
        </div>
        <div>
          <div className="text-sm font-semibold text-[var(--text-primary)]">Arjun Patil</div>
          <div className="text-xs text-[var(--text-muted)]">Student</div>
        </div>
      </div>
    </aside>
  );
}
