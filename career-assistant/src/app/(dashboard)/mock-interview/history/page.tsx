'use client';

import { useState, useEffect } from 'react';
import InterviewHistoryTable from '@/components/member6/mock-interview/InterviewHistoryTable';
import { SkeletonCard } from '@/components/member6/shared/Skeleton';
import { InterviewHistoryItem } from '@/types/mock-interview';
import { apiClient } from '@/lib/api';
import { mockInterviewHistory } from '@/lib/mock-data';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';

export default function InterviewHistoryPage() {
  const [history, setHistory] = useState<InterviewHistoryItem[]>(mockInterviewHistory);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await apiClient.getInterviewHistory('student-1');
        if (res.sessions && res.sessions.length > 0) {
          setHistory(res.sessions);
        }
      } catch (err) {
        console.error('Failed to load history from API', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center">
            <History size={20} className="text-accent-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Interview History</h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Review your past mock interview sessions and track improvement
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <SkeletonCard className="h-64" />
      ) : (
        <InterviewHistoryTable history={history} />
      )}
    </motion.div>
  );
}
