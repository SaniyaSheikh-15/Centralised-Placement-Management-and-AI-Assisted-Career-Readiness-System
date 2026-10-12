import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    const body = await req.json();
    const { questionId, answer = '' } = body;

    if (!questionId) {
      return NextResponse.json({ error: 'questionId is required' }, { status: 400 });
    }

    const outcome = serverDb.answerQuestion(sessionId, questionId, answer);

    return NextResponse.json({
      sessionId,
      isComplete: outcome.isComplete,
      nextQuestion: outcome.nextQuestion || null,
      questionNumber: outcome.session.currentQuestionIndex + 1,
      totalQuestions: outcome.session.questions.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit answer' }, { status: 500 });
  }
}
