import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';
import { mockInterviewResult } from '@/lib/mock-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const session = serverDb.getSession(sessionId);

  if (!session) {
    // If querying demo/mock session or fallback
    return NextResponse.json({
      ...mockInterviewResult,
      interviewId: sessionId,
    });
  }

  const result = serverDb.finalizeSession(sessionId);
  return NextResponse.json(result);
}
