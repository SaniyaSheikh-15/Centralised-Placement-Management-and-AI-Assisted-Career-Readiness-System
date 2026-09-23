'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, User } from 'lucide-react';

const routeTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/career-assistant': 'AI Career Assistant',
  '/career-assistant/guidance': 'Personalized Guidance',
  '/mock-interview': 'Mock Interview',
  '/mock-interview/history': 'Interview History',
};

export default function Navbar() {
  const pathname = usePathname();

  const getTitle = () => {
    if (pathname.startsWith('/mock-interview/session')) return 'Live Interview';
    if (pathname.startsWith('/mock-interview/results')) return 'Interview Results';
    return routeTitles[pathname] || 'CampusConnect';
  };

  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const crumbs: { label: string; href: string }[] = [{ label: 'Home', href: '/' }];
    let path = '';
    for (const seg of segments) {
      path += `/${seg}`;
      const title = routeTitles[path];
      if (title) crumbs.push({ label: title, href: path });
    }
    return crumbs;
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-bg-secondary/80 backdrop-blur-xl border-b border-card-border flex items-center justify-between px-6">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">{getTitle()}</h1>
        <div className="flex items-center gap-1 text-xs text-text-muted">
          {getBreadcrumbs().map((crumb, i) => (
            <span key={crumb.href}>
              {i > 0 && <span className="mx-1">/</span>}
              <span className={i === getBreadcrumbs().length - 1 ? 'text-text-secondary' : ''}>
                {crumb.label}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-card transition-colors cursor-pointer">
          <Search size={18} />
        </button>
        {/* Notifications */}
        <button className="relative p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-card transition-colors cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-blue" />
        </button>
        {/* User avatar */}
        <div className="w-9 h-9 rounded-full ai-gradient flex items-center justify-center cursor-pointer">
          <User size={16} className="text-white" />
        </div>
      </div>
    </header>
  );
}
