'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, Target, Download, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card, { CardContent } from '@/components/ui/Card';
import ScoreBreakdownCard from '@/components/member6/mock-interview/ScoreBreakdownCard';
import FeedbackAccordion from '@/components/member6/mock-interview/FeedbackAccordion';
import { SkeletonCard, SkeletonLine } from '@/components/member6/shared/Skeleton';
import { InterviewResultSummary } from '@/types/mock-interview';
import { apiClient } from '@/lib/api';
import { mockInterviewResult } from '@/lib/mock-data';

export default function InterviewResultsPage({ params }: { params: Promise<{ interviewId: string }> }) {
  const resolvedParams = use(params);
  const interviewId = resolvedParams.interviewId;

  const [result, setResult] = useState<InterviewResultSummary>(mockInterviewResult);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadResult() {
      try {
        const res = await apiClient.getInterviewResult(interviewId);
        setResult(res);
      } catch (err: any) {
        console.error('Failed to load interview result from API, using fallback data', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadResult();
  }, [interviewId]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <SkeletonLine width="200px" height="1.5rem" />
        <SkeletonCard className="h-64" />
        <SkeletonCard className="h-48" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/mock-interview"
            className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-accent-blue transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            Back to Mock Interview
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Interview Results</h1>
          <p className="text-sm text-text-secondary mt-1">
            {result.role} • {result.difficulty} • {new Date(result.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-status-warning/10 border border-status-warning/20 flex items-center gap-2 text-xs text-status-warning">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Score Breakdown */}
      <Card>
        <CardContent className="p-8">
          <ScoreBreakdownCard
            overallScore={result.overallScore}
            breakdown={result.scoreBreakdown}
          />
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card>
        <CardContent className="p-6">
          <FeedbackAccordion
            questions={result.questions}
            strengths={result.strengths}
            improvements={result.improvements}
          />
        </CardContent>
      </Card>

      {/* Action CTAs */}
      <div className="flex flex-wrap gap-3 justify-center py-4">
        <Link href="/mock-interview">
          <Button variant="ai" size="lg">
            <RefreshCw size={18} />
            Retake Interview
          </Button>
        </Link>
        <Button variant="secondary" size="lg">
          <Target size={18} />
          Practice Weak Areas
        </Button>
        <Button variant="ghost" size="lg">
          <Download size={18} />
          Download Report
        </Button>
      </div>
    </motion.div>
  );
}
