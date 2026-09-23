'use client';

import { FileText, CheckCircle, XCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { ChatMode } from '@/types/career-assistant';

interface ResumeContextBannerProps {
  hasResume: boolean;
  mode: ChatMode;
  onToggleMode: () => void;
}

export default function ResumeContextBanner({ hasResume, mode, onToggleMode }: ResumeContextBannerProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-bg-secondary border-b border-card-border">
      <div className="flex items-center gap-3">
        {/* Resume status */}
        <div className="flex items-center gap-2">
          <FileText size={14} className={hasResume ? 'text-status-success' : 'text-text-muted'} />
          {hasResume ? (
            <div className="flex items-center gap-1.5">
              <CheckCircle size={12} className="text-status-success" />
              <span className="text-xs font-medium text-status-success">Resume loaded</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <XCircle size={12} className="text-text-muted" />
              <span className="text-xs font-medium text-text-muted">No resume uploaded</span>
            </div>
          )}
        </div>
      </div>

      {/* Mode toggle */}
      <button
        onClick={onToggleMode}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer hover:bg-card"
      >
        {mode === 'general' ? (
          <>
            <ToggleLeft size={18} className="text-text-muted" />
            <span className="text-text-muted">General Mode</span>
          </>
        ) : (
          <>
            <ToggleRight size={18} className="text-accent-purple" />
            <span className="text-accent-purple">Resume Q&A</span>
          </>
        )}
      </button>
    </div>
  );
}
