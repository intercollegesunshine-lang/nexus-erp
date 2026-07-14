import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET: Fetch all assignments and their submissions
export async function GET() {
  const assignments = await (prisma as any).assignment.findMany({
    include: {
      submissions: {
        include: { student: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ success: true, data: assignments });
}

// POST: Create a new assignment
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, subject, dueDate, classId } = body;
    
    const newAssignment = await (prisma as any).assignment.create({
      data: { title, description, subject, dueDate: new Date(dueDate), classId }
    });
    return NextResponse.json({ success: true, data: newAssignment });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create assignment" }, { status: 500 });
  }
}