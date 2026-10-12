'use client';

import { Globe, ExternalLink, Code2 } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

const links = [
  { key: 'githubUrl' as const, label: 'GitHub', icon: Code2 },
  { key: 'linkedinUrl' as const, label: 'LinkedIn', icon: ExternalLink },
  { key: 'portfolioUrl' as const, label: 'Portfolio', icon: Globe },
  { key: 'codingProfileUrl' as const, label: 'Coding Profile', icon: Code2 },
];

export default function OnlinePresenceCard() {
  const { profile } = useStudentProfile();
  const o = profile.onlinePresence;

  const hasAny = Object.values(o).some((v) => !!v);

  return (
    <div className="rounded-xl border border-[#1A2B42] bg-[#0E1B2E] animate-slide-up">
      <div className="flex items-center gap-2.5 border-b border-[#1A2B42] px-6 py-4">
        <Globe className="h-4 w-4 text-[#1683FF]" />
        <h3 className="text-base font-semibold text-[#F1F5F9]">Online Presence</h3>
      </div>
      <div className="px-6 py-5">
        {hasAny ? (
          <div className="flex flex-wrap gap-2">
            {links.map(({ key, label, icon: Icon }) => {
              const url = o[key];
              if (!url) return null;
              return (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-[#1A2B42] bg-[#0A1524] px-3 py-1.5 text-xs font-medium text-[#1683FF] transition-colors hover:bg-[#1683FF] hover:text-white cursor-pointer">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </span>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-sm italic text-[#64748B]">No online profiles added yet</p>
        )}
      </div>
    </div>
  );
}
