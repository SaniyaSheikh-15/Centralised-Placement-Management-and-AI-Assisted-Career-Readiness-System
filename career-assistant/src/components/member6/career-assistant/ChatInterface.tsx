'use client';

import { useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/career-assistant';
import MessageBubble from './MessageBubble';
import AIStreamingLoader from '@/components/member6/shared/AIStreamingLoader';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  isStreaming: boolean;
}

export default function ChatInterface({ messages, isStreaming }: ChatInterfaceProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-6"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isStreaming && (
          <div className="flex justify-start mb-4">
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-lg ai-gradient flex items-center justify-center shrink-0 mt-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/></svg>
              </div>
              <div className="rounded-2xl px-4 py-3 bg-bg-secondary border border-accent-blue/20">
                <AIStreamingLoader />
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
