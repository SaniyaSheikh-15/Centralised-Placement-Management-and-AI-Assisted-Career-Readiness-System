'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Download } from 'lucide-react';
import { useStudentProfile } from '@/features/student-profile/context/StudentProfileContext';

export default function ResumeSummaryCard() {
  const { profile } = useStudentProfile();
  const r = profile.resume;
  const hasResume = r.uploadedResume !== null;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <Card className="border-[var(--border-card)] bg-[var(--bg-card)] animate-slide-up">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base text-[var(--text-primary)]">
          <FileText className="h-4 w-4 text-[var(--accent-primary)]" />
          Resume
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasResume ? (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--color-danger-subtle)] text-lg">
              📄
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{r.fileName}</p>
              <p className="text-xs text-[var(--text-muted)]">{formatFileSize(r.fileSize)}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="mb-3 text-sm italic text-[var(--text-muted)]">No resume uploaded yet</p>
            <Link href="/profile/resume" className="inline-flex items-center gap-2 rounded-lg border border-[var(--border-card)] bg-transparent px-3 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)]">
                <Upload className="h-4 w-4" />
                Upload Resume
              </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
