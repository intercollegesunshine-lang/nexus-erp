import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";

export async function POST(request: Request) {
  try {
    // 1. Verify the user is logged in securely
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse the incoming payment data
    const body = await request.json();
    const { invoiceId, amount } = body;

    if (!invoiceId || !amount) {
      return NextResponse.json({ success: false, error: "Missing payment details" }, { status: 400 });
    }

    // 3. Mark the invoice as PAID in the database
    const updatedInvoice = await prisma.feeInvoice.update({
      where: { id: invoiceId },
      data: { status: 'PAID' }
    });

    // 4. Create a permanent Payment receipt record
    const newPayment = await prisma.payment.create({
      data: {
        invoiceId: invoiceId,
        amountPaid: amount,
        paymentMethod: 'CREDIT_CARD',
        transactionId: `TXN-${Math.floor(Math.random() * 900000) + 100000}` // Generate random TXN ID
      }
    });

    return NextResponse.json({ 
      success: true, 
      transactionId: newPayment.transactionId 
    });

  } catch (error) {
    console.error("Payment API Error:", error);
    return NextResponse.json(
      { success: false, error: "Payment processing failed" }, 
      { status: 500 }
    );
  }
}