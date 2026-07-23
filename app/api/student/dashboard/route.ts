import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the student and deeply include their class assignments and personal submissions!
    const studentProfile = await (prisma as any).studentProfile.findFirst({
      where: { user: { email: session.user.email } },
      include: {
        class: {
          include: {
            schedules: { orderBy: { startTime: 'asc' } },
            // Fetch all assignments for this student's class!
            assignments: { 
              orderBy: { dueDate: 'asc' },
              include: {
                // Fetch the student's own submissions so the UI knows if it's completed
                submissions: {
                  where: { student: { user: { email: session.user.email } } }
                }
              }
            }
          }
        },
        // NEW: Include payments so the PDF generator knows how it was paid!
        fees: { 
          orderBy: { createdAt: 'desc' },
          include: { payments: true } 
        },
        results: { orderBy: { createdAt: 'desc' } },
        attendances: { orderBy: { date: 'desc' } }
      }
    });

    if (!studentProfile) {
      return NextResponse.json({ success: false, error: "Student profile not found" }, { status: 404 });
    }

    // Rename attendances to attendance for the frontend
    const formattedData = {
      ...studentProfile,
      attendance: studentProfile.attendances || []
    };

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error: any) {
    console.error("Student Dashboard API Error:", error.message);
    return NextResponse.json({ success: false, error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}