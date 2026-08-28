'use client';

import { useRef, useEffect, useState } from 'react';

interface AnswerInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  maxWords?: number;
}

export default function AnswerInput({
  value,
  onChange,
  disabled = false,
  maxWords = 500,
}: AnswerInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.length;

  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 300) + 'px';
    }
  }, [value]);

  return (
    <div className="rounded-2xl border border-card-border bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-card-border bg-bg-secondary flex items-center justify-between">
        <span className="text-xs font-medium text-text-secondary">Your Answer</span>
        <div className="flex items-center gap-3 text-xs text-text-muted">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} chars</span>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Type your answer here... Be specific and provide examples where possible."
        rows={6}
        className="
          w-full resize-none bg-transparent px-4 py-4
          text-sm text-text-primary placeholder:text-text-muted
          focus:outline-none disabled:opacity-50
          leading-relaxed
        "
      />
    </div>
  );
}
