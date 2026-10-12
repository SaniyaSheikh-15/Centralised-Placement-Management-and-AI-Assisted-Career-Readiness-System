import {
  DifficultyLevel,
  InterviewType,
  InterviewQuestion,
  InterviewResultSummary,
  InterviewHistoryItem,
} from '@/types/mock-interview';
import { mockInterviewHistory, mockInterviewQuestions } from './mock-data';

export interface StoredInterviewSession {
  sessionId: string;
  studentId: string;
  role: string;
  difficulty: DifficultyLevel;
  type: InterviewType;
  questionCount: number;
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  isComplete: boolean;
  createdAt: string;
  completedAt?: string;
  result?: InterviewResultSummary;
}

// Global in-memory storage simulating server-side database
class ServerDatabase {
  private sessions: Map<string, StoredInterviewSession> = new Map();
  private history: InterviewHistoryItem[] = [...mockInterviewHistory];

  constructor() {
    // Seed initial demo session
    const demoSession: StoredInterviewSession = {
      sessionId: 'demo-session-001',
      studentId: 'student-1',
      role: 'Full-Stack Developer',
      difficulty: 'Intermediate',
      type: 'Mixed',
      questionCount: 5,
      currentQuestionIndex: 0,
      questions: mockInterviewQuestions,
      isComplete: false,
      createdAt: new Date().toISOString(),
    };
    this.sessions.set(demoSession.sessionId, demoSession);
  }

  // Create a new interview session with dynamic question generation
  createSession(
    studentId: string,
    role: string,
    difficulty: DifficultyLevel,
    type: InterviewType,
    questionCount: number
  ): StoredInterviewSession {
    const sessionId = `int-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const questions = this.generateQuestionsForRole(role, difficulty, type, questionCount);

    const session: StoredInterviewSession = {
      sessionId,
      studentId,
      role,
      difficulty,
      type,
      questionCount,
      currentQuestionIndex: 0,
      questions,
      isComplete: false,
      createdAt: new Date().toISOString(),
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  getSession(sessionId: string): StoredInterviewSession | undefined {
    return this.sessions.get(sessionId);
  }

  // Answer a question in the session and evaluate
  answerQuestion(
    sessionId: string,
    questionId: string,
    userAnswer: string
  ): { session: StoredInterviewSession; nextQuestion?: InterviewQuestion; isComplete: boolean } {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    const questionIndex = session.questions.findIndex((q) => q.id === questionId);
    if (questionIndex === -1) throw new Error('Question not found');

    // Score and evaluate the question
    const score = this.evaluateAnswer(userAnswer, session.questions[questionIndex]);
    session.questions[questionIndex].userAnswer = userAnswer;
    session.questions[questionIndex].score = score;

    const nextIndex = questionIndex + 1;
    session.currentQuestionIndex = nextIndex;

    if (nextIndex >= session.questions.length) {
      session.isComplete = true;
      session.completedAt = new Date().toISOString();
      session.result = this.compileResult(session);

      // Add to history
      this.history.unshift({
        sessionId: session.sessionId,
        date: new Date().toISOString().split('T')[0],
        role: session.role,
        difficulty: session.difficulty,
        overallScore: session.result.overallScore,
        technical: session.result.scoreBreakdown.technical,
        communication: session.result.scoreBreakdown.communication,
      });

      return { session, isComplete: true };
    }

    return {
      session,
      nextQuestion: session.questions[nextIndex],
      isComplete: false,
    };
  }

  // Finish or end session early
  finalizeSession(sessionId: string): InterviewResultSummary {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('Session not found');

    if (!session.result) {
      session.isComplete = true;
      session.completedAt = new Date().toISOString();
      session.result = this.compileResult(session);

      this.history.unshift({
        sessionId: session.sessionId,
        date: new Date().toISOString().split('T')[0],
        role: session.role,
        difficulty: session.difficulty,
        overallScore: session.result.overallScore,
        technical: session.result.scoreBreakdown.technical,
        communication: session.result.scoreBreakdown.communication,
      });
    }

    return session.result;
  }

  getHistory(studentId: string): InterviewHistoryItem[] {
    return this.history;
  }

  private evaluateAnswer(answer: string, question: InterviewQuestion): number {
    if (!answer || answer.trim().length === 0) return 0;
    const words = answer.trim().split(/\s+/).length;
    // Dynamic score simulation based on length and technical keywords
    let score = Math.min(65 + Math.floor(words * 0.4), 95);
    if (answer.toLowerCase().includes('because') || answer.toLowerCase().includes('example') || answer.toLowerCase().includes('experience')) {
      score += 5;
    }
    return Math.min(Math.max(score, 40), 98);
  }

  private compileResult(session: StoredInterviewSession): InterviewResultSummary {
    const answered = session.questions.filter((q) => q.score !== undefined);
    const avgScore = answered.length > 0
      ? Math.round(answered.reduce((acc, q) => acc + (q.score || 0), 0) / answered.length)
      : 70;

    const technical = Math.min(Math.max(avgScore + Math.floor(Math.random() * 8) - 4, 30), 98);
    const communication = Math.min(Math.max(avgScore + Math.floor(Math.random() * 6) - 3, 35), 96);
    const confidence = Math.min(Math.max(avgScore + Math.floor(Math.random() * 10) - 5, 40), 95);
    const relevance = Math.min(Math.max(avgScore + Math.floor(Math.random() * 6) - 2, 45), 98);

    const strengths = [
      `Demonstrated solid technical grasp relevant to ${session.role}`,
      'Clear, coherent structure in articulating solutions and scenarios',
      'Effective handling of conceptual trade-offs and best practices',
      'Good depth of thought regarding practical implementation',
    ];

    const improvements = [
      'Elaborate more on quantifiable business impacts and performance metrics',
      'Incorporate edge-case considerations earlier in technical responses',
      'Structure behavioral answers strictly with the STAR methodology',
      'Deepen knowledge of distributed scaling and cloud primitives',
    ];

    return {
      interviewId: session.sessionId,
      role: session.role,
      date: new Date().toISOString(),
      difficulty: session.difficulty,
      overallScore: avgScore,
      scoreBreakdown: { technical, communication, confidence, relevance },
      strengths,
      improvements,
      questions: session.questions,
    };
  }

  private generateQuestionsForRole(
    role: string,
    difficulty: DifficultyLevel,
    type: InterviewType,
    count: number
  ): InterviewQuestion[] {
    const questionBank: Record<string, { text: string; category: string; aiAnswer: string; feedback: string }[]> = {
      default: [
        {
          text: `What are the core technical principles you apply when designing a scalable architecture for ${role}?`,
          category: 'Technical',
          aiAnswer: 'Key considerations include modular service boundaries, horizontal scalability, stateless compute layers, distributed caching (e.g. Redis), asynchronous messaging (Kafka/RabbitMQ), and robust monitoring/observability.',
          feedback: 'Strong answer. Make sure to clearly mention database sharding and caching strategies.',
        },
        {
          text: 'Tell me about a high-pressure situation where a production issue occurred. How did you diagnose and resolve it?',
          category: 'Behavioral',
          aiAnswer: 'Follow STAR: Situation (downtime/spike), Task (triage & root-cause), Action (log telemetry, rollback or hotfix deployment, post-mortem), Result (SLA restored, monitoring added to prevent recurrence).',
          feedback: 'Effective structure. Quantifying impact and emphasizing team communication strengthens the response.',
        },
        {
          text: `How do you approach performance optimization and memory efficiency in ${role} projects?`,
          category: 'Technical',
          aiAnswer: 'Profile CPU/memory bottlenecks, optimize query indexes, implement memoization/caching, minimize bundle sizes, and use lazy loading and connection pooling.',
          feedback: 'Good technical clarity. Consider citing specific profiling tools you use.',
        },
        {
          text: 'How do you handle disagreements on technical architecture within your engineering team?',
          category: 'Behavioral',
          aiAnswer: 'Focus on objective criteria, proof-of-concepts, benchmarking data, RFCs (Request for Comments), and maintaining psychological safety while aligning on team consensus.',
          feedback: 'Demonstrates high emotional intelligence and mature engineering collaboration.',
        },
        {
          text: `Explain how you implement automated testing, CI/CD, and quality assurance in your development lifecycle.`,
          category: 'Technical',
          aiAnswer: 'Use test pyramids (Unit, Integration, E2E), automated GitHub Actions/GitLab CI pipelines with linting, code coverage thresholds, containerized testing, and canary/blue-green deployments.',
          feedback: 'Comprehensive lifecycle coverage.',
        },
        {
          text: 'Describe how you maintain data consistency across distributed services.',
          category: 'System Design',
          aiAnswer: 'Discuss ACID vs BASE, two-phase commit (2PC), Saga pattern (orchestration vs choreography), event sourcing, and eventual consistency using idempotent event handlers.',
          feedback: 'Excellent architectural depth.',
        },
      ],
    };

    const pool = questionBank.default;
    const questions: InterviewQuestion[] = [];

    for (let i = 0; i < count; i++) {
      const template = pool[i % pool.length];
      questions.push({
        id: `q-${i + 1}-${Date.now().toString(36)}`,
        questionNumber: i + 1,
        questionText: template.text,
        category: template.category,
        aiSuggestedAnswer: template.aiAnswer,
        feedback: template.feedback,
      });
    }

    return questions;
  }
}

// Global singleton instance across Next.js API requests
const globalForDb = globalThis as unknown as { serverDb?: ServerDatabase };
export const serverDb = globalForDb.serverDb ?? new ServerDatabase();
if (process.env.NODE_ENV !== 'production') globalForDb.serverDb = serverDb;
