'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/profile': 'Profile Overview',
  '/profile/edit': 'Edit Profile',
  '/profile/skills': 'Skills Management',
  '/profile/projects': 'Projects',
  '/profile/certifications': 'Certifications',
  '/profile/resume': 'Resume Upload',
};

export default function TopNavbar() {
  const pathname = usePathname();
  const pageTitle = pageTitles[pathname] || 'Student Profile';

  return (
    <header className="fixed left-[260px] right-0 top-0 z-40 flex h-[60px] items-center justify-between border-b border-[var(--border-card)] bg-[rgba(11,20,34,0.8)] px-8 backdrop-blur-xl max-md:left-0 max-md:px-4">
      {/* Left — Page Title */}
      <div className="flex items-center">
        <h1 className="text-lg font-bold text-[var(--text-primary)]">{pageTitle}</h1>
      </div>

      {/* Right — Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-lg border border-[var(--border-card)] bg-[var(--bg-card)] px-3 py-2 transition-colors focus-within:border-[var(--accent-primary)] md:flex">
          <Search className="h-3.5 w-3.5 opacity-50" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full min-w-[160px] border-none bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          />
        </div>

        {/* Notifications */}
        <button className="relative text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--color-danger)] text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-white/[0.04]">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-xs font-bold text-white">
            AP
          </div>
          <div className="hidden flex-col md:flex">
            <span className="text-sm font-semibold text-[var(--text-primary)]">Arjun Patil</span>
            <span className="text-xs text-[var(--text-muted)]">Student</span>
          </div>
        </div>
      </div>
    </header>
  );
}
