import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { className, timetableUrl } = body;

    if (!className || !timetableUrl) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Upsert the class. If it doesn't exist yet, create it with the timetable.
    // If it does exist, update its timetable.
    const updatedClass = await prisma.class.upsert({
      where: { name: String(className) },
      update: { timetableUrl: String(timetableUrl) },
      create: { 
        name: String(className),
        timetableUrl: String(timetableUrl)
      }
    });

    return NextResponse.json({ success: true, data: updatedClass });
  } catch (error: any) {
    console.error("Failed to update timetable:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}