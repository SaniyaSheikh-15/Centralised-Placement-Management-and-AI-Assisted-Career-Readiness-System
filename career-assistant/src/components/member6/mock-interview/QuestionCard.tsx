'use client';

import { Bot, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  questionText: string;
  category: string;
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  questionText,
  category,
}: QuestionCardProps) {
  return (
    <motion.div
      key={questionNumber}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-accent-blue/20 bg-card p-6 ai-glow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg ai-gradient flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-accent-blue uppercase tracking-wider">
            AI Interviewer
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-accent-purple/10 border border-accent-purple/20">
          <Tag size={12} className="text-accent-purple" />
          <span className="text-xs font-medium text-accent-purple">{category}</span>
        </div>
      </div>

      <p className="text-text-primary text-base leading-relaxed font-medium">
        {questionText}
      </p>

      <div className="mt-4 pt-3 border-t border-card-border flex items-center justify-between">
        <span className="text-xs text-text-muted">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="text-xs text-text-muted">
          Take your time to think before answering
        </span>
      </div>
    </motion.div>
  );
}
