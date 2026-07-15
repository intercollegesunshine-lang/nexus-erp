import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      invoiceId, // This might be a single ID or a comma-separated list like "id1,id2"
      amount
    } = body;

    if (!invoiceId) {
      return NextResponse.json({ success: false, error: "Missing invoice ID" }, { status: 400 });
    }

    // 1. Verify the Razorpay Signature for security
    const secret = process.env.RAZORPAY_KEY_SECRET || "";
    
    // Create the expected signature using your secret key
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest('hex');

    // If the signatures don't match, someone is trying to spoof a payment!
    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch. Payment verification failed.");
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }

    // 2. Split the combined invoice IDs (in case they paid for 2+ things at once)
    const invoiceIds = invoiceId.split(',');

    // 3. Mark ALL associated fee invoices as 'PAID' in the database simultaneously
    await prisma.feeInvoice.updateMany({
      where: {
        id: {
          in: invoiceIds
        }
      },
      data: {
        status: 'PAID'
      }
    });

    // 4. Create permanent Payment receipt records for each paid invoice
    // First, fetch the invoices to get their individual amounts
    const invoices = await prisma.feeInvoice.findMany({
      where: { id: { in: invoiceIds } }
    });

    const paymentCreations = invoices.map((inv, index) => {
       return prisma.payment.create({
         data: {
           invoiceId: inv.id,
           amountPaid: inv.amount,
           paymentMethod: 'RAZORPAY',
           // Ensure the transaction ID is unique even if multiple invoices were paid in one swoop
           transactionId: `${razorpay_payment_id}_${index}` 
         }
       });
    });

    await Promise.all(paymentCreations);

    return NextResponse.json({ success: true, message: "Payment verified successfully" });

  } catch (error: any) {
    console.error("Payment Verification API Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error during verification" }, { status: 500 });
  }
}