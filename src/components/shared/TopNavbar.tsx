'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

const pageTitles: Record<string, string> = {
  '/profile': 'Dashboard Overview',
  '/profile/edit': 'Student Profile',
  '/profile/skills': 'Skills Management',
  '/profile/projects': 'Projects',
  '/profile/certifications': 'Certifications',
  '/profile/resume': 'Resume Analyzer',
  '/profile/eligibility': 'Drive Eligibility',
  '/profile/drives': 'Placement Drives',
  '/profile/applications': 'My Applications',
  '/profile/placement-match': 'Placement Match',
  '/profile/skill-gap': 'Skill Gap Analysis',
  '/profile/assistant': 'AI Career Assistant',
  '/profile/mock-interview': 'Mock Interview Prep',
  '/profile/analytics': 'Placement Analytics',
};

export default function TopNavbar() {
  const pathname = usePathname();
  const { profile } = useStudentProfile();
  const pageTitle = pageTitles[pathname] || 'Dashboard';

  const studentName = profile?.personalInfo?.fullName || 'Aryan Sharma';
  const initials = studentName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('') || 'AS';

  return (
    <header className="fixed left-[260px] right-0 top-0 z-40 flex h-[60px] items-center justify-between border-b border-[#131F33] bg-[#070E1A] px-8 max-md:left-0 max-md:px-4">
      {/* Left — Page Title */}
      <div className="flex items-center">
        <h1 className="text-base font-bold text-[#F1F5F9]">{pageTitle}</h1>
      </div>

      {/* Right — Search, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden items-center gap-2 rounded-lg border border-[#16263D] bg-[#0D1829] px-3 py-1.5 transition-colors focus-within:border-[#1E4C8A] md:flex">
          <Search className="h-3.5 w-3.5 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search drives, skills..."
            className="w-full min-w-[160px] border-none bg-transparent text-xs text-[#F1F5F9] outline-none placeholder:text-[#64748B]"
          />
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="View notifications"
          className="relative text-[#8E9EB5] transition-colors hover:text-[#F1F5F9]"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#EF4444] text-[9px] font-bold text-white">
            3
          </span>
        </button>

        {/* Profile */}
        <div className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-white/[0.04]">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] text-xs font-bold text-white">
            {initials}
          </div>
          <div className="hidden flex-col md:flex">
            <span className="text-xs font-semibold text-[#F1F5F9]">{studentName}</span>
            <span className="text-[10px] text-[#64748B]">Student</span>
          </div>
        </div>
      </div>
    </header>
  );
}
