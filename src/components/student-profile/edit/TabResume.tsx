'use client';

import ResumeUploader from '@/components/student-profile/resume/ResumeUploader';

export default function TabResume() {
  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold uppercase tracking-wider text-[var(--text-muted)]">Resume Upload</p>
      <ResumeUploader />
      <div className="rounded-lg border border-[var(--border-card)] bg-[var(--accent-primary-subtle)] p-4">
        <p className="text-sm text-[var(--accent-primary)]">
          📄 <strong>Tip:</strong> Upload a single-page, ATS-friendly PDF resume. Keep file size under 5 MB. Your resume will be shared with recruiters during the application process.
        </p>
      </div>
    </div>
  );
}
