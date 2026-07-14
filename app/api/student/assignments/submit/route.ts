import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Verify the student is logged in securely
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { assignmentId, fileUrl } = body;

    if (!assignmentId || !fileUrl) {
       return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // 2. Find the exact student profile associated with this login
    const student = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { studentProfile: true }
    });

    if (!student?.studentProfile?.id) {
       return NextResponse.json({ success: false, error: "Student profile not found" }, { status: 404 });
    }

    // 3. Create or Update the Submission in the Database!
    // Using upsert allows them to resubmit a new file before it is graded.
    const submission = await (prisma as any).submission.upsert({
      where: {
        studentId_assignmentId: {
          studentId: student.studentProfile.id,
          assignmentId: String(assignmentId)
        }
      },
      update: {
        fileUrl: String(fileUrl),
        status: "SUBMITTED",
        submittedAt: new Date()
      },
      create: {
        studentId: student.studentProfile.id,
        assignmentId: String(assignmentId),
        fileUrl: String(fileUrl),
        status: "SUBMITTED"
      }
    });

    return NextResponse.json({ success: true, data: submission });
  } catch (error: any) {
    console.error("Assignment Submission API Error:", error.message);
    return NextResponse.json({ success: false, error: "Failed to submit assignment" }, { status: 500 });
  }
}