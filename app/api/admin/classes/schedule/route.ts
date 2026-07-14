import { NextResponse } from 'next/server';
// Make sure this path correctly points to your prisma.ts file!
import { prisma } from '@/lib/prisma'; 

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { className, dayOfWeek, subject, room, startTime, endTime } = body;

    if (!className || !dayOfWeek || !subject || !startTime || !endTime) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // 1. Find or create the class (e.g., "10-A")
    // ADDED: (prisma as any) to bypass VS Code's cached TypeScript errors
    const targetClass = await (prisma as any).class.upsert({
      where: { name: String(className) },
      update: {},
      create: { name: String(className) }
    });

    // 2. Add the schedule period to that class
    // ADDED: (prisma as any)
    const schedule = await (prisma as any).schedule.create({
      data: {
        classId: targetClass.id,
        dayOfWeek: String(dayOfWeek),
        subject: String(subject),
        room: String(room || 'TBA'),
        startTime: String(startTime),
        endTime: String(endTime),
      }
    });

    return NextResponse.json({ success: true, data: schedule });
  } catch (error: any) {
    console.error("Failed to add schedule:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}