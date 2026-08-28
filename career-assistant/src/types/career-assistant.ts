export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  referencesResume?: boolean;
}

export interface CareerGuidanceContext {
  targetRole: string;
  currentSkills: string[];
  missingSkills: string[];
  recommendedRoadmap: {
    step: number;
    title: string;
    description: string;
  }[];
}

export type ChatMode = 'general' | 'resume';
