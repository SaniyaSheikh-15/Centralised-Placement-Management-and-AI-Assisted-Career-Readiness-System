'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, SkipForward, XCircle, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import QuestionCard from '@/components/member6/mock-interview/QuestionCard';
import AnswerInput from '@/components/member6/mock-interview/AnswerInput';
import { SkeletonCard, SkeletonLine } from '@/components/member6/shared/Skeleton';
import { InterviewQuestion } from '@/types/mock-interview';
import { apiClient } from '@/lib/api';
import { mockInterviewQuestions } from '@/lib/mock-data';

export default function InterviewSessionPage({ params }: { params: Promise<{ interviewId: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const interviewId = resolvedParams.interviewId;

  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [showEndModal, setShowEndModal] = useState(false);

  // Fetch session data from API
  useEffect(() => {
    async function loadSession() {
      try {
        const sessionData = await apiClient.getInterviewSession(interviewId);
        if (sessionData && sessionData.questions && sessionData.questions.length > 0) {
          setQuestions(sessionData.questions);
          setCurrentIndex(sessionData.currentQuestionIndex || 0);
        } else {
          setQuestions(mockInterviewQuestions);
        }
      } catch (err) {
        console.error('Failed to load session, falling back to default question bank', err);
        setQuestions(mockInterviewQuestions);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, [interviewId]);

  // Running Timer
  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Guard against accidental back navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const totalQuestions = questions.length || 5;
  const currentQuestion = questions[currentIndex] || {
    id: `q-${currentIndex + 1}`,
    questionNumber: currentIndex + 1,
    questionText: 'Loading question...',
    category: 'Technical',
  };
  const progress = totalQuestions > 0 ? ((currentIndex) / totalQuestions) * 100 : 0;

  const handleSubmitAnswer = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Send answer to Backend API: POST /api/interview/:sessionId/answer
      const res = await apiClient.submitInterviewAnswer(interviewId, currentQuestion.id, answer);

      if (res.isComplete || currentIndex >= totalQuestions - 1) {
        router.push(`/mock-interview/results/${interviewId}`);
      } else {
        setCurrentIndex((prev) => prev + 1);
        setAnswer('');
      }
    } catch (err) {
      console.error('Submit answer API error:', err);
      // Fallback transition
      if (currentIndex < totalQuestions - 1) {
        setCurrentIndex((prev) => prev + 1);
        setAnswer('');
      } else {
        router.push(`/mock-interview/results/${interviewId}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [currentIndex, totalQuestions, isSubmitting, router, interviewId, currentQuestion.id, answer]);

  const handleSkip = async () => {
    try {
      await apiClient.submitInterviewAnswer(interviewId, currentQuestion.id, '[Skipped]');
    } catch (err) {
      console.error('Skip error:', err);
    }

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setAnswer('');
    } else {
      router.push(`/mock-interview/results/${interviewId}`);
    }
  };

  const handleEndEarly = () => {
    setShowEndModal(false);
    router.push(`/mock-interview/results/${interviewId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <SkeletonCard className="h-20" />
        <SkeletonCard className="h-44" />
        <SkeletonCard className="h-36" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* HUD Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-card-border bg-card p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-text-primary">
              Question {currentIndex + 1} of {totalQuestions}
            </span>
            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-accent-purple/10 text-accent-purple">
              {currentQuestion.category}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Clock size={14} />
            <span className="font-mono">{formatTime(timer)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
          <motion.div
            className="h-full ai-gradient rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {/* Question */}
      <QuestionCard
        questionNumber={currentQuestion.questionNumber || currentIndex + 1}
        totalQuestions={totalQuestions}
        questionText={currentQuestion.questionText}
        category={currentQuestion.category}
      />

      {/* Answer */}
      <AnswerInput value={answer} onChange={setAnswer} disabled={isSubmitting} />

      {/* Controls */}
      <div className="flex items-center justify-between gap-3">
        <Button
          variant="danger"
          size="md"
          onClick={() => setShowEndModal(true)}
        >
          <XCircle size={16} />
          End Interview
        </Button>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="md" onClick={handleSkip} disabled={isSubmitting}>
            <SkipForward size={16} />
            Skip
          </Button>
          <Button
            variant="ai"
            size="md"
            onClick={handleSubmitAnswer}
            disabled={!answer.trim() || isSubmitting}
            isLoading={isSubmitting}
          >
            {currentIndex === totalQuestions - 1 ? 'Finish Interview' : 'Submit & Next'}
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>

      {/* End Interview Modal */}
      <Modal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        title="End Interview Early?"
        size="sm"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-status-warning/10 border border-status-warning/20">
            <AlertTriangle size={20} className="text-status-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                You have {Math.max(totalQuestions - currentIndex - 1, 0)} questions remaining
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Ending early will submit your current progress. Unanswered questions will be marked as skipped.
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowEndModal(false)}>
              Continue Interview
            </Button>
            <Button variant="danger" onClick={handleEndEarly}>
              End & View Results
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
