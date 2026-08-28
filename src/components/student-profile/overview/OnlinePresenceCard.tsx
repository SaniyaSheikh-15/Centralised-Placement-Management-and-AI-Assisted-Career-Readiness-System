'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, ExternalLink, Code2 } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

const links = [
  { key: 'githubUrl' as const, label: 'GitHub', icon: Code2 },
  { key: 'linkedinUrl' as const, label: 'LinkedIn', icon: ExternalLink },
  { key: 'portfolioUrl' as const, label: 'Portfolio', icon: Globe },
  { key: 'codingProfileUrl' as const, label: 'Coding', icon: Code2 },
];

export default function OnlinePresenceCard() {
  const { profile } = useStudentProfile();
  const o = profile.onlinePresence;

  const hasAny = Object.values(o).some((v) => !!v);

  return (
    <Card className="border-[var(--border-card)] bg-[var(--bg-card)] animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-[var(--text-primary)]">
          <Globe className="h-4 w-4 text-[var(--accent-primary)]" />
          Online Presence
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasAny ? (
          <div className="flex flex-wrap gap-2">
            {links.map(({ key, label, icon: Icon }) => {
              const url = o[key];
              if (!url) return null;
              return (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer">
                  <Badge variant="secondary" className="gap-1.5 bg-[var(--accent-primary-subtle)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-colors cursor-pointer px-3 py-1.5">
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </Badge>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-sm italic text-[var(--text-muted)]">No online profiles added yet</p>
        )}
      </CardContent>
    </Card>
  );
}
