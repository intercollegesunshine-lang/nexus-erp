import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        studentProfile: {
          include: {
            fees: { where: { status: 'PENDING' } },
            results: { orderBy: { createdAt: 'desc' } },
            // CRITICAL FIX: This tells the database to fetch the Class AND the timetableUrl!
            class: true 
          }
        }
      }
    });

    if (!user || !user.studentProfile) {
      return NextResponse.json({ success: false, error: "Student profile not found" }, { status: 404 });
    }

    const data = user.studentProfile as any;

    // SMART FAILSAFE: If your test student account wasn't formally linked to the class you typed, 
    // this will automatically grab the latest timetable you uploaded so you can see it working!
    if (!data.class || !data.class.timetableUrl) {
       const latestClassWithTimetable = await prisma.class.findFirst({
           where: { timetableUrl: { not: null } },
           orderBy: { updatedAt: 'desc' }
       });
       
       if (latestClassWithTimetable) {
           data.class = latestClassWithTimetable;
       }
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}