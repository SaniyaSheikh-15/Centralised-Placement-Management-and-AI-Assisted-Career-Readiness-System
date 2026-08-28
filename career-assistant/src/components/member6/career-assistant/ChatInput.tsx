'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isStreaming: boolean;
  maxChars?: number;
}

export default function ChatInput({ onSend, isStreaming, maxChars = 2000 }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 200) + 'px';
    }
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const charCount = value.length;
  const isOverLimit = charCount > maxChars;

  return (
    <div className="border-t border-card-border bg-bg-secondary p-4">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        {/* Attach button */}
        <button
          className="shrink-0 p-2.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-card transition-colors cursor-pointer"
          title="Attach file"
        >
          <Paperclip size={18} />
        </button>

        {/* Input area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? 'Waiting for response...' : 'Ask me anything about your career...'}
            disabled={isStreaming}
            rows={1}
            className="
              w-full resize-none bg-card border border-card-border rounded-xl
              px-4 py-3 text-sm text-text-primary placeholder:text-text-muted
              focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20
              disabled:opacity-50 transition-colors
            "
          />
          {/* Char count */}
          <div className={`absolute bottom-1.5 right-3 text-[10px] ${isOverLimit ? 'text-status-danger' : 'text-text-muted'}`}>
            {charCount > 0 && `${charCount}/${maxChars}`}
          </div>
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!value.trim() || isStreaming || isOverLimit}
          className="
            shrink-0 p-2.5 rounded-xl ai-gradient text-white
            disabled:opacity-40 disabled:cursor-not-allowed
            hover:opacity-90 transition-all cursor-pointer
            shadow-lg shadow-accent-blue/20
          "
        >
          <Send size={18} />
        </button>
      </div>
      <p className="text-[11px] text-text-muted text-center mt-2">
        Press <kbd className="px-1 py-0.5 rounded bg-card text-text-secondary text-[10px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-card text-text-secondary text-[10px]">Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}
