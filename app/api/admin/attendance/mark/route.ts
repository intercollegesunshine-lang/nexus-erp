import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, date, status, remarks, subject } = body;
    const attendanceSubject = subject || 'Overall';

    if (!studentId || !date || !status) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // "upsert" ensures a student only gets ONE record per subject per day.
    const attendance = await (prisma as any).attendance.upsert({
      where: {
        studentId_date_subject: {
          studentId: String(studentId),
          date: new Date(date),
          subject: String(attendanceSubject)
        }
      },
      update: {
        status: String(status),
        remarks: remarks ? String(remarks) : null
      },
      create: {
        studentId: String(studentId),
        date: new Date(date),
        subject: String(attendanceSubject),
        status: String(status),
        remarks: remarks ? String(remarks) : null
      }
    });

    return NextResponse.json({ success: true, data: attendance });
  } catch (error: any) {
    console.error("Failed to mark attendance:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}