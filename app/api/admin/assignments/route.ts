import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const assignments = await (prisma as any).assignment.findMany({
      include: {
        // NEW: Also fetch the class name so we can display it on the dashboard!
        class: { select: { name: true } },
        submissions: {
          include: {
            student: {
              include: { user: { select: { email: true } } }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: assignments });
  } catch (error: any) {
    console.error("Failed to fetch assignments:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // NEW: We now extract className from your form submission
    const { title, description, dueDate, subject, className } = body;

    if (!title || !dueDate || !subject || !className) {
      return NextResponse.json({ success: false, error: "Missing required fields, including Class Name." }, { status: 400 });
    }

    // Safely find or create the target class (e.g., "10-A")
    const targetClass = await (prisma as any).class.upsert({
      where: { name: String(className) },
      update: {},
      create: { name: String(className) }
    });

    // Create the assignment and link it ONLY to the target class
    const newAssignment = await (prisma as any).assignment.create({
      data: {
        title,
        description: description || "",
        dueDate: new Date(dueDate),
        subject,
        classId: targetClass.id 
      }
    });

    return NextResponse.json({ success: true, data: newAssignment });
  } catch (error: any) {
    console.error("Failed to create assignment:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}