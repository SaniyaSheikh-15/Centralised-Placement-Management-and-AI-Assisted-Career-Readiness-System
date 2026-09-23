'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Play, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import { roleOptions } from '@/lib/mock-data';
import { DifficultyLevel, InterviewType } from '@/types/mock-interview';
import { apiClient } from '@/lib/api';

const difficulties: DifficultyLevel[] = ['Beginner', 'Intermediate', 'Advanced'];
const types: InterviewType[] = ['Technical', 'Behavioral', 'System Design', 'Mixed'];
const questionCounts = [5, 10, 15];

export default function InterviewConfigModal() {
  const router = useRouter();
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel | ''>('');
  const [type, setType] = useState<InterviewType | ''>('');
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [isStarting, setIsStarting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isValid = role && difficulty && type && questionCount > 0;

  const handleStart = async () => {
    if (!isValid) return;
    setIsStarting(true);
    setErrorMessage(null);

    try {
      // Real API Call: POST /api/interview/start
      const res = await apiClient.startInterview({
        role,
        difficulty: difficulty as DifficultyLevel,
        type: type as InterviewType,
        questionCount,
      });

      // Route to dynamically created interview session
      router.push(`/mock-interview/session/${res.sessionId}`);
    } catch (err: any) {
      console.error('Failed to start interview:', err);
      setErrorMessage('Failed to initialize AI interview. Please try again.');
      setIsStarting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-card-border bg-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-card-border bg-bg-secondary">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl ai-gradient flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Start AI Mock Interview</h2>
            <p className="text-sm text-text-secondary">Configure your interview session</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-6 space-y-6">
        {errorMessage && (
          <div className="p-3 rounded-xl bg-status-danger/10 border border-status-danger/20 flex items-center gap-2 text-xs text-status-danger">
            <AlertCircle size={14} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Target Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-bg-primary border border-card-border rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 appearance-none cursor-pointer"
          >
            <option value="" className="text-text-muted">Select a role...</option>
            {roleOptions.map((r) => (
              <option key={r} value={r} className="bg-bg-primary">{r}</option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Difficulty Level</label>
          <div className="flex gap-2">
            {difficulties.map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`
                  flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                  ${difficulty === d
                    ? 'ai-gradient text-white shadow-lg shadow-accent-blue/20'
                    : 'bg-bg-primary border border-card-border text-text-secondary hover:border-accent-blue/30'
                  }
                `}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Interview Type */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Interview Type</label>
          <div className="grid grid-cols-2 gap-2">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`
                  px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                  ${type === t
                    ? 'bg-accent-blue/10 border border-accent-blue text-accent-blue'
                    : 'bg-bg-primary border border-card-border text-text-secondary hover:border-accent-blue/30'
                  }
                `}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Number of Questions</label>
          <div className="flex gap-2">
            {questionCounts.map((c) => (
              <button
                key={c}
                onClick={() => setQuestionCount(c)}
                className={`
                  flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                  ${questionCount === c
                    ? 'bg-accent-purple/10 border border-accent-purple text-accent-purple'
                    : 'bg-bg-primary border border-card-border text-text-secondary hover:border-accent-purple/30'
                  }
                `}
              >
                {c} Questions
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <Button
          variant="ai"
          size="lg"
          className="w-full"
          disabled={!isValid}
          isLoading={isStarting}
          onClick={handleStart}
        >
          <Play size={18} />
          Start AI Interview
        </Button>
      </div>
    </motion.div>
  );
}
