'use client';

import { motion } from 'framer-motion';
import MetricScoreRing from '@/components/member6/shared/MetricScoreRing';

interface ScoreBreakdownCardProps {
  overallScore: number;
  breakdown: {
    technical: number;
    communication: number;
    confidence: number;
    relevance: number;
  };
}

const labels: Record<string, string> = {
  technical: 'Technical',
  communication: 'Communication',
  confidence: 'Confidence',
  relevance: 'Relevance',
};

export default function ScoreBreakdownCard({ overallScore, breakdown }: ScoreBreakdownCardProps) {
  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center py-6"
      >
        <MetricScoreRing score={overallScore} size={160} strokeWidth={10} />
        <h2 className="text-xl font-bold text-text-primary mt-4">Overall Performance</h2>
        <p className="text-sm text-text-secondary mt-1">
          {overallScore >= 80
            ? 'Excellent! You performed remarkably well.'
            : overallScore >= 50
            ? 'Good effort! Some areas need improvement.'
            : 'Keep practicing! Focus on the improvement areas below.'}
        </p>
      </motion.div>

      {/* Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(breakdown).map(([key, value], i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex flex-col items-center p-4 rounded-xl border border-card-border bg-bg-secondary"
          >
            <MetricScoreRing score={value} size={80} strokeWidth={6} />
            <span className="text-xs font-medium text-text-secondary mt-3 text-center">
              {labels[key]}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
