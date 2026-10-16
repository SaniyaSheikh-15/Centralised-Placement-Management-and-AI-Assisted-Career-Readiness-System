
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Search,
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
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/profile', label: 'Dashboard', icon: LayoutGrid },
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

const pageTitles: Record<string, string> = Object.fromEntries(
  navItems.map(({ href, label }) => [href, href === '/profile' ? 'Dashboard' : label])
);

export default function TopNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  const pageTitle =
    pageTitles[pathname] ||
    navItems.find(
      (item) =>
        pathname.startsWith(item.href + '/') && item.href !== '/profile'
    )?.label ||
    'Student Profile';

  const fullName = user
    ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || 'Student'
    : 'Student';

  const initials = user
    ? `${user.first_name?.[0] ?? ''}${user.last_name?.[0] ?? ''}`.toUpperCase() || 'ST'
    : 'ST';

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return [];

    return navItems.filter((item) =>
      item.label.toLowerCase().includes(query)
    );
  }, [search]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setIsSearchOpen(false);
    setSearch('');
    setActiveIndex(0);
  }, [pathname]);

  function navigateToResult(href: string) {
    setIsSearchOpen(false);
    setSearch('');
    router.push(href);
  }

  function handleSearchKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === 'Escape') {
      setIsSearchOpen(false);
      return;
    }

    if (event.key === 'ArrowDown' && results.length > 0) {
      event.preventDefault();
      setIsSearchOpen(true);
      setActiveIndex((index) => (index + 1) % results.length);
    }

    if (event.key === 'ArrowUp' && results.length > 0) {
      event.preventDefault();
      setIsSearchOpen(true);
      setActiveIndex(
        (index) => (index - 1 + results.length) % results.length
      );
    }

    if (event.key === 'Enter' && results.length > 0) {
      event.preventDefault();
      navigateToResult(results[activeIndex]?.href ?? results[0].href);
    }
  }

  return (
    <header className="fixed left-[260px] right-0 top-0 z-40 flex h-[60px] items-center justify-between border-b border-[#1A2B42] bg-[#09111E] px-8 max-md:left-0 max-md:px-4">
      {/* Page title */}
      <div className="flex min-w-0 items-center">
        <h1 className="truncate text-lg font-bold text-[#F1F5F9]">
          {pageTitle}
        </h1>
      </div>

      {/* Search, notifications, and profile */}
      <div className="flex items-center gap-4">
        {/* Functional page search */}
        <div
          ref={searchContainerRef}
          className="relative hidden md:block"
        >
          <div className="flex items-center gap-2 rounded-lg border border-[#1A2B42] bg-[#0E1B2E] px-3 py-2 transition-colors focus-within:border-[#1683FF]">
            <Search className="h-3.5 w-3.5 shrink-0 text-[#64748B]" />

            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setActiveIndex(0);
                setIsSearchOpen(true);
              }}
              onFocus={() => {
                if (search.trim()) setIsSearchOpen(true);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search pages..."
              aria-label="Search dashboard pages"
              aria-expanded={isSearchOpen && results.length > 0}
              aria-autocomplete="list"
              className="w-full min-w-[160px] border-none bg-transparent text-sm text-[#F1F5F9] outline-none placeholder:text-[#64748B]"
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setIsSearchOpen(false);
                }}
                aria-label="Clear search"
                className="text-[#64748B] hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {isSearchOpen && search.trim() && (
            <div className="absolute right-0 top-full z-50 mt-2 max-h-80 w-64 overflow-y-auto rounded-xl border border-[#1A2B42] bg-[#0B1728] p-2 shadow-xl">
              {results.length > 0 ? (
                <div className="space-y-1" role="listbox" aria-label="Search results">
                  {results.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.href}
                        type="button"
                        role="option"
                        aria-selected={index === activeIndex}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => navigateToResult(item.href)}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                          index === activeIndex
                            ? 'bg-[#0E2447] text-white'
                            : 'text-[#94A3B8] hover:bg-white/[0.04] hover:text-white'
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-[#60A5FA]" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="px-3 py-4 text-center text-sm text-[#64748B]">
                  No matching pages found.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          className="relative text-[#94A3B8] transition-colors hover:text-[#F1F5F9]"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#EF4444] text-[10px] font-bold text-white">
            3
          </span>
        </button>

        {/* Authenticated user */}
        <div className="flex items-center gap-2 rounded-lg px-2 py-1">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-gradient-to-br from-[#1683FF] to-[#7C5CFC] text-xs font-bold text-white">
            {initials}
          </div>

          <div className="hidden flex-col md:flex">
            <span className="text-sm font-semibold text-[#F1F5F9]">
              {fullName}
            </span>
            <span className="text-xs text-[#64748B]">Student</span>
          </div>
        </div>
      </div>
    </header>
  );
}
