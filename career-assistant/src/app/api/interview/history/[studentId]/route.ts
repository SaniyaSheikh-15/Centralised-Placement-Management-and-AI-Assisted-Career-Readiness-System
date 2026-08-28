import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await params;
  const history = serverDb.getHistory(studentId);

  return NextResponse.json({
    studentId,
    sessions: history,
    totalSessions: history.length,
  });
}
