'use client';

import { useState } from 'react';
import {
  Radio,
  Play,
  CheckCircle2,
  Clock,
  Award,
  Video,
  Mic,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface InterviewModule {
  id: string;
  title: string;
  type: string;
  duration: string;
  questionsCount: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Hard';
  description: string;
}

const modules: InterviewModule[] = [
  {
    id: '1',
    title: 'Core DSA & Algorithms Round',
    type: 'Technical Coding',
    duration: '45 mins',
    questionsCount: 3,
    difficulty: 'Intermediate',
    description: 'Arrays, Trees, Graph traversals, and complexity analysis simulation.',
  },
  {
    id: '2',
    title: 'Full Stack & Web Architecture',
    type: 'System & Frameworks',
    duration: '35 mins',
    questionsCount: 5,
    difficulty: 'Intermediate',
    description: 'React lifecycle, state management, REST API architecture, and database indexing.',
  },
  {
    id: '3',
    title: 'HR & Behavioral Competency',
    type: 'HR & Cultural Fit',
    duration: '25 mins',
    questionsCount: 4,
    difficulty: 'Beginner',
    description: 'STAR method answers, situational problem solving, and career goals.',
  },
];

export default function MockInterviewPage() {
  const [activeSession, setActiveSession] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-[#16263D] bg-gradient-to-r from-[#0C1A2E] via-[#0D2447] to-[#0A1626] p-6 shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#1E4C8A] bg-[#0E274D] text-[#60A5FA]">
              <Radio className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Mock Interview Studio</h2>
              <p className="mt-1 text-sm text-[#94A3B8]">
                Interactive practice sessions with real-time feedback, speech pacing analysis, and instant scoring.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#16263D] bg-[#0A1424] px-4 py-2">
            <Award className="h-5 w-5 text-amber-400" />
            <div>
              <div className="text-xs text-[#64748B]">Average Score</div>
              <div className="text-sm font-bold text-white">84 / 100</div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {modules.map((m) => (
          <div
            key={m.id}
            className="flex flex-col justify-between rounded-xl border border-[#16263D] bg-[#0A1424] p-5 transition-all hover:border-[#1E4C8A]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                  {m.type}
                </span>
                <span className="text-xs text-[#64748B]">{m.duration}</span>
              </div>
              <h3 className="mt-3 font-bold text-white">{m.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">{m.description}</p>
              <div className="mt-4 flex items-center gap-3 text-xs text-[#64748B]">
                <span>{m.questionsCount} Questions</span>
                <span>•</span>
                <span
                  className={
                    m.difficulty === 'Hard'
                      ? 'text-rose-400'
                      : m.difficulty === 'Intermediate'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                  }
                >
                  {m.difficulty}
                </span>
              </div>
            </div>

            <div className="mt-5 border-t border-[#131F33] pt-4">
              <button
                onClick={() => setActiveSession(m.id)}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#1683FF] to-[#7C5CFC] py-2 text-xs font-semibold text-white shadow-md hover:opacity-95"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Start Practice Session</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Session Notification / Status */}
      {activeSession && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-400">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">
              Session initialized! Camera and microphone permissions requested.
            </span>
            <button
              onClick={() => setActiveSession(null)}
              className="text-xs text-white underline hover:opacity-80"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
