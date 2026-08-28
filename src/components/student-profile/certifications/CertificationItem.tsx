'use client';

import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ExternalLink, Calendar } from 'lucide-react';
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
    return `${months[parseInt(month, 10) - 1]} ${year}`;
  };

  return (
    <div className="group flex items-start gap-4 rounded-xl border border-[var(--border-card)] bg-[var(--bg-card)] p-4 transition-all hover:border-[rgba(22,131,255,0.25)]">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--color-warning-subtle)] text-xl">🏆</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-[var(--text-primary)]">{certification.name}</h4>
        <p className="text-sm text-[var(--text-secondary)]">{certification.organization}</p>
        <div className="mt-2 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1 text-[var(--text-muted)]">
            <Calendar className="h-3 w-3" /> {formatDate(certification.date)}
          </span>
          {certification.link && (
            <a href={certification.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-[var(--accent-primary)] transition-colors hover:text-[var(--accent-primary-hover)]">
              <ExternalLink className="h-3 w-3" /> View Credential
            </a>
          )}
        </div>
      </div>
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(certification)} title="Edit">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-[var(--color-danger)] hover:text-[var(--color-danger)]" onClick={() => onDelete(certification)} title="Delete">
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
