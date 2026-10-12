'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MessageSquare,
  Mic,
  LayoutDashboard,
  Compass,
  History,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavSection {
  section: string;
  items: NavLink[];
}

type NavItem = NavLink | NavSection;

function isNavLink(item: NavItem): item is NavLink {
  return 'href' in item;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    section: 'AI Career',
    items: [
      {
        label: 'Career Assistant',
        href: '/career-assistant',
        icon: MessageSquare,
        badge: 'AI',
      },
      {
        label: 'Guidance',
        href: '/career-assistant/guidance',
        icon: Compass,
      },
    ],
  },
  {
    section: 'Mock Interview',
    items: [
      {
        label: 'Start Interview',
        href: '/mock-interview',
        icon: Mic,
        badge: 'AI',
      },
      {
        label: 'History',
        href: '/mock-interview/history',
        icon: History,
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    // Root dashboard exact match
    if (href === '/') return pathname === '/';

    // Exact match for specific sub-pages
    if (pathname === href) return true;

    // Parent route active state for dynamic child sessions only
    if (href === '/mock-interview') {
      return pathname.startsWith('/mock-interview/session') ||
             pathname.startsWith('/mock-interview/results');
    }

    // Base Career Assistant page only matches when not on sub-pages like /guidance
    if (href === '/career-assistant') {
      return pathname === '/career-assistant';
    }

    return false;
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 z-40 h-full bg-bg-secondary border-r border-card-border
        transition-all duration-300 ease-out flex flex-col
        ${collapsed ? 'w-[72px]' : 'w-[260px]'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-card-border shrink-0">
        <div className="w-8 h-8 rounded-lg ai-gradient flex items-center justify-center shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-lg ai-gradient-text whitespace-nowrap">
            CampusConnect
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
        {navItems.map((item, idx) => {
          if (isNavLink(item)) {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${active
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'text-text-secondary hover:text-text-primary hover:bg-card'
                  }
                `}
              >
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          }

          return (
            <div key={idx} className="mt-4">
              {!collapsed && (
                <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-text-muted">
                  {item.section}
                </p>
              )}
              {collapsed && <div className="border-t border-card-border my-2 mx-2" />}
              <div className="space-y-0.5">
                {item.items.map((sub) => {
                  const Icon = sub.icon;
                  const active = isActive(sub.href);
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                        transition-all duration-200
                        ${active
                          ? 'bg-accent-blue/10 text-accent-blue'
                          : 'text-text-secondary hover:text-text-primary hover:bg-card'
                        }
                      `}
                      title={collapsed ? sub.label : undefined}
                    >
                      <Icon size={20} className="shrink-0" />
                      {!collapsed && (
                        <>
                          <span className="flex-1">{sub.label}</span>
                          {sub.badge && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md ai-gradient text-white">
                              {sub.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-3 border-t border-card-border shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-card transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
