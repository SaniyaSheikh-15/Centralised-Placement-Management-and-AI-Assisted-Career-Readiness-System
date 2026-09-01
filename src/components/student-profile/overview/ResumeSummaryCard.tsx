'use client';

import Link from 'next/link';
import { FileText, Upload } from 'lucide-react';
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
    <div className="rounded-xl border border-[#1A2B42] bg-[#0E1B2E] animate-slide-up">
      <div className="flex items-center gap-2.5 border-b border-[#1A2B42] px-6 py-4">
        <FileText className="h-4 w-4 text-[#1683FF]" />
        <h3 className="text-base font-semibold text-[#F1F5F9]">Resume</h3>
      </div>
      <div className="px-6 py-5">
        {hasResume ? (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-lg">
              📄
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-[#F1F5F9]">{r.fileName}</p>
              <p className="text-xs text-[#64748B]">{formatFileSize(r.fileSize)}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="mb-3 text-sm text-[#64748B]">No resume uploaded yet</p>
            <Link
              href="/profile/resume"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1683FF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0D6FE0]"
            >
              <Upload className="h-4 w-4" />
              Upload Resume
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
