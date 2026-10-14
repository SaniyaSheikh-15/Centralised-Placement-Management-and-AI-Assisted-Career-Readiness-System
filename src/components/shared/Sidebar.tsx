'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  CircleDot,
  Building2,
  FileText,
  Check,
  Sparkles,
  Target,
  Zap,
  Bot,
  Radio,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
}

const navItems: NavItem[] = [
  { href: '/profile', label: 'Dashboard', icon: LayoutGrid, exact: true },
  { href: '/profile/edit', label: 'Profile', icon: CircleDot },
  { href: '/profile/drives', label: 'Placement Drives', icon: Building2 },
  { href: '/profile/applications', label: 'Applications', icon: FileText },
  { href: '/profile/eligibility', label: 'Eligibility', icon: Check },
  { href: '/profile/resume', label: 'Resume Analyzer', icon: Sparkles },
  { href: '/profile/placement-match', label: 'Placement Match', icon: Target },
  { href: '/profile/skill-gap', label: 'Skill Gap', icon: Zap },
  { href: '/profile/assistant', label: 'Assistant', icon: Bot },
  { href: '/profile/mock-interview', label: 'Mock Interview', icon: Radio },
  { href: '/profile/analytics', label: 'Analytics', icon: TrendingUp },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile } = useStudentProfile();

  const studentName = profile?.personalInfo?.fullName || 'Aryan Sharma';
  // Compute clean 2-letter initials
  const initials = studentName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'AS';

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 flex w-[260px] flex-col border-r border-[#131F33] bg-[#070E1A] max-md:hidden">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 px-5 pt-5 pb-3">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-[#38BDF8]"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
        </svg>
        <span className="text-[17px] font-bold tracking-tight text-white">
          CampusConnect
        </span>
      </div>

      {/* User Card */}
      <div className="mx-3 mb-2 mt-1 flex items-center gap-3 rounded-xl border border-[#16263D] bg-[#0D1829] p-3 shadow-sm">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] text-xs font-bold text-white shadow-inner">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-white">
            {studentName}
          </div>
          <div className="text-[11px] text-[#64748B]">Student account</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-3 py-2 scrollbar-none">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-150 ${
                isActive
                  ? 'border border-[#1E4C8A] bg-[#0E2447] text-white shadow-[0_0_15px_rgba(30,76,138,0.25)]'
                  : 'border border-transparent text-[#8E9EB5] hover:bg-white/[0.04] hover:text-[#F1F5F9]'
              }`}
            >
              <Icon
                className={`h-[17px] w-[17px] shrink-0 transition-colors ${
                  isActive ? 'text-[#60A5FA]' : 'text-[#72849E] group-hover:text-[#CBD5E1]'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-[#131F33] p-3">
        <button
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/profile';
            }
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-[#8E9EB5] transition-colors hover:bg-white/[0.04] hover:text-[#F1F5F9]"
        >
          <LogOut className="h-[17px] w-[17px] text-[#72849E]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}