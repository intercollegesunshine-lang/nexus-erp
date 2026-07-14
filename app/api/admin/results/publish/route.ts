import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, examName, subject, marksObtained, totalMarks, grade, remarks } = body;

    if (!studentId || !examName || !subject || !marksObtained || !totalMarks || !grade) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newResult = await prisma.examResult.create({
      data: {
        studentId: String(studentId),
        examName: String(examName),
        subject: String(subject),
        marksObtained: parseFloat(marksObtained),
        totalMarks: parseFloat(totalMarks),
        grade: String(grade),
        remarks: remarks ? String(remarks) : null
      }
    });

    return NextResponse.json({ success: true, data: newResult });
  } catch (error: any) {
    console.error("Failed to publish result:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}