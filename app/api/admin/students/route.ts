import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Attempt 1: Fetch with the brand new Attendance relation
    const students = await (prisma as any).studentProfile.findMany({
      include: {
        class: true, 
        user: {
          select: { email: true } 
        },
        fees: { orderBy: { createdAt: 'desc' } },
        results: { orderBy: { createdAt: 'desc' } },
        attendances: { orderBy: { date: 'desc' } } // FIXED: Prisma added an "s"
      },
      orderBy: { createdAt: 'desc' }
    });

    // FIXED: Rename it back to 'attendance' so the Admin UI doesn't break!
    const formattedStudents = students.map((s: any) => ({
      ...s,
      attendance: s.attendances || []
    }));

    return NextResponse.json({ success: true, data: formattedStudents });
  } catch (error: any) {
    console.error("Prisma Sync Error (Attendance):", error.message);
    
    try {
      // Attempt 2: Safe Fallback fetch without Attendance
      // This guarantees your dashboard loads even if the Prisma engine cache is stuck!
      const safeStudents = await prisma.studentProfile.findMany({
        include: {
          class: true, 
          user: {
            select: { email: true } 
          },
          fees: { orderBy: { createdAt: 'desc' } },
          results: { orderBy: { createdAt: 'desc' } }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      return NextResponse.json({ success: true, data: safeStudents });
    } catch (fallbackError: any) {
      console.error("Database connection failed completely:", fallbackError.message);
      return NextResponse.json({ success: false, error: "Failed to fetch student data." }, { status: 500 });
    }
  }
}