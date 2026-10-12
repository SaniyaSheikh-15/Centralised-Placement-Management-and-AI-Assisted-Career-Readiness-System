export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type InterviewType = 'Technical' | 'Behavioral' | 'System Design' | 'Mixed';

export interface InterviewConfig {
  role: string;
  difficulty: DifficultyLevel;
  type: InterviewType;
  questionCount: number;
}

export interface InterviewQuestion {
  id: string;
  questionNumber: number;
  questionText: string;
  category: string;
  userAnswer?: string;
  aiSuggestedAnswer?: string;
  feedback?: string;
  score?: number;
}

export interface InterviewResultSummary {
  interviewId: string;
  role: string;
  date: string;
  difficulty: DifficultyLevel;
  overallScore: number;
  scoreBreakdown: {
    technical: number;
    communication: number;
    confidence: number;
    relevance: number;
  };
  strengths: string[];
  improvements: string[];
  questions: InterviewQuestion[];
}

export interface InterviewHistoryItem {
  sessionId: string;
  date: string;
  role: string;
  difficulty: DifficultyLevel;
  overallScore: number;
  technical: number;
  communication: number;
}
