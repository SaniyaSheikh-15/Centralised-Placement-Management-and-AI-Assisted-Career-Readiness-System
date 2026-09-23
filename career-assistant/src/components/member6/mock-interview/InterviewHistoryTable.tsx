'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, Mic, TrendingUp } from 'lucide-react';
import { InterviewHistoryItem } from '@/types/mock-interview';

interface InterviewHistoryTableProps {
  history: InterviewHistoryItem[];
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-status-success';
  if (score >= 50) return 'text-status-warning';
  return 'text-status-danger';
}

function getScoreBg(score: number) {
  if (score >= 80) return 'bg-status-success/10';
  if (score >= 50) return 'bg-status-warning/10';
  return 'bg-status-danger/10';
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'Beginner': return 'text-status-success bg-status-success/10';
    case 'Intermediate': return 'text-status-warning bg-status-warning/10';
    case 'Advanced': return 'text-status-danger bg-status-danger/10';
    default: return 'text-text-muted bg-card';
  }
}

export default function InterviewHistoryTable({ history }: InterviewHistoryTableProps) {
  if (history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl border border-card-border bg-card p-12 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-card-border/20 flex items-center justify-center mx-auto mb-4">
          <Mic size={28} className="text-text-muted" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">No interviews yet</h3>
        <p className="text-sm text-text-secondary mt-2 max-w-sm mx-auto">
          Start your first mock interview to see your performance history here.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-card-border bg-card overflow-hidden"
    >
      <div className="px-6 py-4 border-b border-card-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp size={18} className="text-accent-blue" />
          <h3 className="font-semibold text-text-primary">Interview History</h3>
        </div>
        <span className="text-xs text-text-muted">{history.length} sessions</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border">
              <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Difficulty</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Overall</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Technical</th>
              <th className="text-center px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Communication</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item, i) => (
              <tr
                key={item.sessionId}
                className="border-b border-card-border/50 hover:bg-bg-primary/50 transition-colors"
              >
                <td className="px-6 py-4 text-text-secondary whitespace-nowrap">
                  {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="px-6 py-4 text-text-primary font-medium whitespace-nowrap">{item.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                    {item.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-bold ${getScoreColor(item.overallScore)} ${getScoreBg(item.overallScore)}`}>
                    {item.overallScore}%
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-text-secondary">{item.technical}%</td>
                <td className="px-6 py-4 text-center text-text-secondary">{item.communication}%</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/mock-interview/results/${item.sessionId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-accent-blue hover:bg-accent-blue/10 transition-colors"
                  >
                    <Eye size={14} />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
