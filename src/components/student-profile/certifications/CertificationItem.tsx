'use client';

import { Pencil, Trash2, ExternalLink, Award } from 'lucide-react';
import type { Certification } from '@/types/student-profile';

interface CertificationItemProps {
  certification: Certification;
  onEdit: (cert: Certification) => void;
  onDelete: (cert: Certification) => void;
}

export default function CertificationItem({ certification, onEdit, onDelete }: CertificationItemProps) {
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `Issued ${months[parseInt(month, 10) - 1]} ${year}`;
  };

  return (
    <div className="group flex items-center justify-between rounded-xl border border-[#1A2B42] bg-[#0E1B2E] p-5 transition-all hover:border-[rgba(22,131,255,0.5)]">
      <div className="flex items-center gap-4 min-w-0">
        {/* Award Icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(22,131,255,0.15)] text-[#1683FF]">
          <Award className="h-5 w-5" />
        </div>

        {/* Details */}
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-[#F1F5F9]">{certification.name}</h4>
          <p className="text-xs text-[#94A3B8]">
            {certification.organization} · {formatDate(certification.date)}
          </p>
          {certification.link && (
            <a
              href={certification.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-xs text-[#1683FF] transition-colors hover:underline"
            >
              <ExternalLink className="h-3 w-3" />
              Verify Credential
            </a>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(certification)}
          className="rounded-md p-1.5 text-[#94A3B8] transition-colors hover:bg-white/10 hover:text-[#F1F5F9]"
          title="Edit"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => onDelete(certification)}
          className="rounded-md p-1.5 text-[#EF4444] transition-colors hover:bg-red-500/10"
          title="Delete"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
