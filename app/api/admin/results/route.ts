import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from "next-auth/next";

// FIXED: Now imports from the correct, active configuration file!
import { authOptions } from "@/lib/auth"; 

// Define the expected shape of the request body for strict TypeScript validation
interface PublishGradeRequest {
  studentId: string;
  examName: string;
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    // 1. Get the grade data submitted by the Admin with strict typing
    const body: PublishGradeRequest = await request.json();
    const { studentId, examName, subject, marksObtained, totalMarks, grade } = body;

    // 2. Save it permanently to the database linked to this specific studentId
    const newResult = await prisma.examResult.create({
      data: {
        studentId,
        examName,
        subject,
        marksObtained,
        totalMarks,
        grade,
      }
    });

    return NextResponse.json({ success: true, data: newResult });

  } catch (error) {
    console.error("Admin Result API Error:", error);
    return NextResponse.json({ success: false, error: "Failed to publish result" }, { status: 500 });
  }
}