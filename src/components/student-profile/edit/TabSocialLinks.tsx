'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

export default function TabSocialLinks() {
  const { editDraft, updateOnlinePresence } = useStudentProfile();
  const o = editDraft.onlinePresence;

  return (
    <div className="space-y-6">
      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Online Profiles</legend>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input id="github" value={o.githubUrl} onChange={(e) => updateOnlinePresence({ githubUrl: e.target.value })} placeholder="https://github.com/username" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input id="linkedin" value={o.linkedinUrl} onChange={(e) => updateOnlinePresence({ linkedinUrl: e.target.value })} placeholder="https://linkedin.com/in/username" />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="portfolio">Portfolio URL</Label>
            <Input id="portfolio" value={o.portfolioUrl} onChange={(e) => updateOnlinePresence({ portfolioUrl: e.target.value })} placeholder="https://yourportfolio.dev" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coding">Coding Profile URL</Label>
            <Input id="coding" value={o.codingProfileUrl} onChange={(e) => updateOnlinePresence({ codingProfileUrl: e.target.value })} placeholder="https://leetcode.com/username" />
          </div>
        </div>
      </fieldset>

      <div className="rounded-lg border border-[var(--border-card)] bg-[var(--accent-primary-subtle)] p-4">
        <p className="text-sm text-[var(--accent-primary)]">
          💡 <strong>Tip:</strong> Adding your GitHub and LinkedIn profiles helps recruiters verify your skills and professional background during the placement process.
        </p>
      </div>
    </div>
  );
}
