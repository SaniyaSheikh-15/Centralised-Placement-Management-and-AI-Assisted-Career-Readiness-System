import { DifficultyLevel, InterviewType, InterviewQuestion, InterviewResultSummary, InterviewHistoryItem } from '@/types/mock-interview';

export interface ChatApiResponse {
  conversationId: string;
  reply: string;
  createdAt: string;
}

export interface ResumeStatusResponse {
  hasResume: boolean;
  fileName?: string;
  uploadedAt?: string;
  status?: string;
}

export interface GuidanceApiResponse {
  recommendedRole: string;
  reasoning: string;
  skillsToLearn: string[];
  projectsToBuild: { title: string; description: string }[];
  certifications: string[];
  roadmap: { step: string; order: number }[];
}

export interface StartInterviewResponse {
  sessionId: string;
  role: string;
  difficulty: DifficultyLevel;
  type: InterviewType;
  totalQuestions: number;
  firstQuestion: InterviewQuestion;
  createdAt: string;
}

export interface AnswerInterviewResponse {
  sessionId: string;
  isComplete: boolean;
  nextQuestion: InterviewQuestion | null;
  questionNumber: number;
  totalQuestions: number;
}

export interface HistoryApiResponse {
  studentId: string;
  sessions: InterviewHistoryItem[];
  totalSessions: number;
}

export const apiClient = {
  // Send message to AI Career Assistant (General Mode)
  async sendChatMessage(message: string, studentId = 'student-1', conversationId?: string): Promise<ChatApiResponse> {
    const res = await fetch('/api/assistant/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, message, conversationId }),
    });
    if (!res.ok) throw new Error(`Chat API error: ${res.statusText}`);
    return res.json();
  },

  // Send question to Resume Q&A Mode
  async sendResumeQA(question: string, studentId = 'student-1'): Promise<{ answer: string; referencesResume: boolean }> {
    const res = await fetch('/api/assistant/resume-qa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, question }),
    });
    if (!res.ok) throw new Error(`Resume Q&A API error: ${res.statusText}`);
    return res.json();
  },

  // Get student resume status
  async getResumeStatus(studentId = 'student-1'): Promise<ResumeStatusResponse> {
    const res = await fetch(`/api/resume/${studentId}/status`);
    if (!res.ok) throw new Error(`Resume status API error: ${res.statusText}`);
    return res.json();
  },

  // Get personalized career guidance roadmap
  async getGuidance(studentId = 'student-1'): Promise<GuidanceApiResponse> {
    const res = await fetch(`/api/assistant/guidance/${studentId}`);
    if (!res.ok) throw new Error(`Guidance API error: ${res.statusText}`);
    return res.json();
  },

  // Start new mock interview session
  async startInterview(config: {
    role: string;
    difficulty: DifficultyLevel;
    type: InterviewType;
    questionCount: number;
    studentId?: string;
  }): Promise<StartInterviewResponse> {
    const res = await fetch('/api/interview/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: 'student-1', ...config }),
    });
    if (!res.ok) throw new Error(`Start interview API error: ${res.statusText}`);
    return res.json();
  },

  // Fetch session details
  async getInterviewSession(sessionId: string) {
    const res = await fetch(`/api/interview/${sessionId}/session`);
    if (!res.ok) throw new Error(`Get interview session API error: ${res.statusText}`);
    return res.json();
  },

  // Submit interview answer
  async submitInterviewAnswer(sessionId: string, questionId: string, answer: string): Promise<AnswerInterviewResponse> {
    const res = await fetch(`/api/interview/${sessionId}/answer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questionId, answer }),
    });
    if (!res.ok) throw new Error(`Submit answer API error: ${res.statusText}`);
    return res.json();
  },

  // Fetch final evaluation report
  async getInterviewResult(sessionId: string): Promise<InterviewResultSummary> {
    const res = await fetch(`/api/interview/${sessionId}/result`);
    if (!res.ok) throw new Error(`Get result API error: ${res.statusText}`);
    return res.json();
  },

  // Fetch interview history
  async getInterviewHistory(studentId = 'student-1'): Promise<HistoryApiResponse> {
    const res = await fetch(`/api/interview/history/${studentId}`);
    if (!res.ok) throw new Error(`Get history API error: ${res.statusText}`);
    return res.json();
  },
};
