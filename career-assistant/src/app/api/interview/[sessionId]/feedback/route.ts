import { NextRequest, NextResponse } from 'next/server';
import { serverDb } from '@/lib/server-db';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const session = serverDb.getSession(sessionId);

  if (!session) {
    return NextResponse.json({
      strengths: [
        'Good structured explanation of foundational principles',
        'Clear and confident communication',
      ],
      improvements: [
        'Add quantifiable metrics to strengthen technical impact',
        'Deepen system architecture edge case coverage',
      ],
    });
  }

  const result = serverDb.finalizeSession(sessionId);
  return NextResponse.json({
    strengths: result.strengths,
    improvements: result.improvements,
  });
}
