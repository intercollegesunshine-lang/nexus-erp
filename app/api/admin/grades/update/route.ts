import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { submissionId, grade } = body;

    if (!submissionId || !grade) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Update the submission in the database with the new grade
    // We also change the status from 'SUBMITTED' to 'GRADED'
    const updatedSubmission = await (prisma as any).submission.update({
      where: { id: String(submissionId) },
      data: { 
        grade: String(grade),
        status: 'GRADED'
      }
    });

    return NextResponse.json({ success: true, data: updatedSubmission });
  } catch (error: any) {
    console.error("Failed to save grade:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}