'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '@/types/career-assistant';
import { Bot, User, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  message: ChatMessage;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[85%] lg:max-w-[75%]`}>
        {/* Avatar */}
        <div
          className={`
            w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1
            ${isUser ? 'bg-card border border-card-border' : 'ai-gradient'}
          `}
        >
          {isUser ? (
            <User size={14} className="text-text-secondary" />
          ) : (
            <Bot size={14} className="text-white" />
          )}
        </div>

        {/* Message bubble */}
        <div
          className={`
            rounded-2xl px-4 py-3
            ${isUser
              ? 'bg-card border border-card-border text-text-primary'
              : 'bg-bg-secondary border border-accent-blue/20 text-text-primary'
            }
          `}
        >
          {/* Resume reference badge */}
          {message.referencesResume && (
            <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-card-border">
              <FileText size={12} className="text-accent-purple" />
              <span className="text-[11px] font-medium text-accent-purple">
                Based on your resume
              </span>
            </div>
          )}

          {/* Content */}
          {isUser ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="markdown-content text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          )}

          {/* Timestamp */}
          <p className={`text-[11px] mt-2 ${isUser ? 'text-text-muted text-right' : 'text-text-muted'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
