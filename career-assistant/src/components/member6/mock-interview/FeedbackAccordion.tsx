'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CheckCircle, AlertCircle, MessageSquare, Bot, User } from 'lucide-react';
import { InterviewQuestion } from '@/types/mock-interview';

interface FeedbackAccordionProps {
  questions: InterviewQuestion[];
  strengths: string[];
  improvements: string[];
}

export default function FeedbackAccordion({ questions, strengths, improvements }: FeedbackAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-status-success/20 bg-status-success/5 p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={18} className="text-status-success" />
            <h3 className="font-semibold text-status-success">Strengths</h3>
          </div>
          <ul className="space-y-2">
            {strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-status-success mt-0.5 shrink-0">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Improvements */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-status-warning/20 bg-status-warning/5 p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={18} className="text-status-warning" />
            <h3 className="font-semibold text-status-warning">Areas to Improve</h3>
          </div>
          <ul className="space-y-2">
            {improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-status-warning mt-0.5 shrink-0">⚠</span>
                {imp}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Question-by-Question Breakdown */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare size={18} className="text-accent-blue" />
          <h3 className="font-semibold text-text-primary">Question-by-Question Breakdown</h3>
        </div>
        <div className="space-y-2">
          {questions.map((q, i) => {
            const isOpen = openIndex === i;
            const scoreColor =
              (q.score ?? 0) >= 80
                ? 'text-status-success bg-status-success/10'
                : (q.score ?? 0) >= 50
                ? 'text-status-warning bg-status-warning/10'
                : 'text-status-danger bg-status-danger/10';

            return (
              <div key={q.id} className="rounded-xl border border-card-border bg-bg-secondary overflow-hidden">
                {/* Header */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-card/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-xs font-bold text-text-muted w-6 text-center shrink-0">
                      Q{q.questionNumber}
                    </span>
                    <span className="text-sm text-text-primary font-medium truncate">
                      {q.questionText}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${scoreColor}`}>
                      {q.score}%
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-card-border pt-4">
                        {/* Your Answer */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <User size={14} className="text-text-muted" />
                            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                              Your Answer
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed bg-card rounded-xl p-4 border border-card-border">
                            {q.userAnswer || 'No answer provided'}
                          </p>
                        </div>

                        {/* AI Benchmark */}
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Bot size={14} className="text-accent-blue" />
                            <span className="text-xs font-semibold text-accent-blue uppercase tracking-wider">
                              AI Benchmark Answer
                            </span>
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed bg-accent-blue/5 rounded-xl p-4 border border-accent-blue/20">
                            {q.aiSuggestedAnswer || 'N/A'}
                          </p>
                        </div>

                        {/* Feedback */}
                        {q.feedback && (
                          <div className="px-4 py-3 rounded-xl bg-accent-purple/5 border border-accent-purple/20">
                            <span className="text-xs font-semibold text-accent-purple uppercase tracking-wider">
                              Feedback
                            </span>
                            <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                              {q.feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
