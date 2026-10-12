import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const session = serverDb.getSession(sessionId);

  if (!session) {
    return NextResponse.json({ error: 'Interview session not found' }, { status: 404 });
  }

  return NextResponse.json({
    sessionId: session.sessionId,
    role: session.role,
    difficulty: session.difficulty,
    type: session.type,
    questionCount: session.questionCount,
    currentQuestionIndex: session.currentQuestionIndex,
    currentQuestion: session.questions[session.currentQuestionIndex] || null,
    totalQuestions: session.questions.length,
    questions: session.questions,
    isComplete: session.isComplete,
  });
}
