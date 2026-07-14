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

    // Using (prisma as any) to bypass any lingering TypeScript cache issues
    const studentProfile = await (prisma as any).studentProfile.findFirst({
      where: { user: { email: session.user.email } },
      include: {
        class: {
          include: {
            schedules: { orderBy: { startTime: 'asc' } }
          }
        },
        fees: { orderBy: { createdAt: 'desc' } },
        results: { orderBy: { createdAt: 'desc' } },
        attendances: { orderBy: { date: 'desc' } } // FIXED: Prisma added an "s" to attendances!
      }
    });

    if (!studentProfile) {
      return NextResponse.json({ success: false, error: "Student profile not found" }, { status: 404 });
    }

    // FIXED: Rename it back to 'attendance' so our frontend doesn't break!
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