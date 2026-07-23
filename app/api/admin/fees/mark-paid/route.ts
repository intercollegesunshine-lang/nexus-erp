import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invoiceId } = body;

    if (!invoiceId) {
      return NextResponse.json({ success: false, error: "Missing invoice ID" }, { status: 400 });
    }

    // 1. Find the invoice to get the amount
    const invoice = await prisma.feeInvoice.findUnique({ where: { id: invoiceId } });
    if (!invoice) return NextResponse.json({ success: false, error: "Invoice not found" }, { status: 404 });
    if (invoice.status === 'PAID') return NextResponse.json({ success: false, error: "Already paid" }, { status: 400 });

    // 2. Mark the invoice as PAID
    await prisma.feeInvoice.update({
      where: { id: invoiceId },
      data: { status: 'PAID' }
    });

    // 3. Create a Cash Payment Record to track it
    const payment = await prisma.payment.create({
      data: {
        invoiceId: invoiceId,
        amountPaid: invoice.amount,
        paymentMethod: 'CASH (OFFLINE)',
        transactionId: `CASH-${Math.floor(Math.random() * 900000) + 100000}`
      }
    });

    return NextResponse.json({ success: true, data: payment });
  } catch (error: any) {
    console.error("Failed to mark fee as paid (Cash):", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}