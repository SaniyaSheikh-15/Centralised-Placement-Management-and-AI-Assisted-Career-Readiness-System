'use client';

import { useState, useEffect } from 'react';
import InterviewConfigModal from '@/components/member6/mock-interview/InterviewConfigModal';
import InterviewHistoryTable from '@/components/member6/mock-interview/InterviewHistoryTable';
import { InterviewHistoryItem } from '@/types/mock-interview';
import { apiClient } from '@/lib/api';
import { mockInterviewHistory } from '@/lib/mock-data';

export default function MockInterviewPage() {
  const [history, setHistory] = useState<InterviewHistoryItem[]>(mockInterviewHistory);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await apiClient.getInterviewHistory('student-1');
        if (res.sessions && res.sessions.length > 0) {
          setHistory(res.sessions);
        }
      } catch (err) {
        console.error('Failed to load history from API', err);
      }
    }
    loadHistory();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Config - takes 2 columns */}
        <div className="lg:col-span-2">
          <InterviewConfigModal />
        </div>

        {/* History - takes 3 columns */}
        <div className="lg:col-span-3">
          <InterviewHistoryTable history={history} />
        </div>
      </div>
    </div>
  );
}
