import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, title, amount, dueDate } = body;

    if (!studentId || !title || !amount || !dueDate) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newInvoice = await prisma.feeInvoice.create({
      data: {
        studentId: String(studentId),
        title: String(title),
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        status: "PENDING"
      }
    });

    return NextResponse.json({ success: true, data: newInvoice });
  } catch (error: any) {
    console.error("Failed to assign fee:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}