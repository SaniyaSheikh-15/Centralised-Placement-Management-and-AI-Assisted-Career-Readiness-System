import { NextRequest, NextResponse } from 'next/server';
import { mockGuidanceData } from '@/lib/mock-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const { studentId } = await params;

  return NextResponse.json({
    studentId,
    ...mockGuidanceData,
    lastUpdated: new Date().toISOString(),
  });
}
