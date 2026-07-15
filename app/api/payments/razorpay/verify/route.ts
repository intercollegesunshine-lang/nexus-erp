import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      invoiceId,
      amount
    } = await request.json();

    // 1. Verify the signature securely to prevent spoofing
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }

    // 2. Mark invoice as PAID
    await prisma.feeInvoice.update({
      where: { id: invoiceId },
      data: { status: 'PAID' }
    });

    // 3. Save official payment receipt to DB
    const newPayment = await prisma.payment.create({
      data: {
        invoiceId: invoiceId,
        amountPaid: amount,
        paymentMethod: 'RAZORPAY',
        transactionId: razorpay_payment_id // Save exact Razorpay TXN ID
      }
    });

    return NextResponse.json({ success: true, transactionId: newPayment.transactionId });

  } catch (error: any) {
    console.error("Payment Verification Error:", error);
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 });
  }
}