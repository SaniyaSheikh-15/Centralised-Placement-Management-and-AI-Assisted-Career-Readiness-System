import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';
import { DifficultyLevel, InterviewType } from '@/types/mock-interview';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentId = 'student-1', role, difficulty, type, questionCount } = body;

    if (!role || !difficulty || !type || !questionCount) {
      return NextResponse.json(
        { error: 'Missing required configuration fields (role, difficulty, type, questionCount)' },
        { status: 400 }
      );
    }

    const session = serverDb.createSession(
      studentId,
      role,
      difficulty as DifficultyLevel,
      type as InterviewType,
      Number(questionCount)
    );

    return NextResponse.json({
      sessionId: session.sessionId,
      role: session.role,
      difficulty: session.difficulty,
      type: session.type,
      totalQuestions: session.questions.length,
      firstQuestion: session.questions[0],
      createdAt: session.createdAt,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to initialize interview session' }, { status: 500 });
  }
}
