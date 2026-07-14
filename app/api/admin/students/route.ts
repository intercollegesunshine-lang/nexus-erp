import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const students = await prisma.studentProfile.findMany({
      include: {
        class: true, // Fetch the linked class data (like "10-A")
        user: {
          select: { email: true } // Only grab the email from the linked User account
        }
      },
      orderBy: { createdAt: 'desc' } // Show newest students first
    });

    return NextResponse.json({ success: true, data: students });
  } catch (error: any) {
    console.error("Failed to fetch students:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch student data." }, { status: 500 });
  }
}