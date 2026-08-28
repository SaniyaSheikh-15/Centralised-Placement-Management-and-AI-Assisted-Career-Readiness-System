'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Pencil } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

export default function ProfileHeaderBlock() {
  const { profile } = useStudentProfile();
  const p = profile.personalInfo;

  const initials = p.fullName
    ? p.fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <Card className="border-[var(--border-card)] bg-[var(--bg-card)] animate-slide-up">
      <CardContent className="flex items-center gap-6 p-8 max-md:flex-col max-md:text-center">
        {/* Avatar */}
        <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] text-2xl font-extrabold text-white">
          {p.profilePhoto ? (
            <img src={URL.createObjectURL(p.profilePhoto)} alt={p.fullName} className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="mb-1 text-2xl font-extrabold text-[var(--text-primary)]">
            {p.fullName || 'Unnamed Student'}
          </h2>
          <p className="mb-1 text-base font-semibold text-[var(--accent-primary)]">{p.branch || 'No branch set'}</p>
          <p className="text-sm text-[var(--text-muted)]">
            {profile.academicInfo.degree} · {profile.academicInfo.academicYear}
          </p>
        </div>

        {/* Edit Button */}
        <Link href="/profile/edit" className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-card)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary-subtle)] hover:text-[var(--text-primary)]">
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Link>
      </CardContent>
    </Card>
  );
}
