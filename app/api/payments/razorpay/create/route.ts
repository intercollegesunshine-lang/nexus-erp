import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { invoiceId, amount } = await request.json();

    if (!invoiceId || !amount) {
      return NextResponse.json({ success: false, error: "Missing details" }, { status: 400 });
    }

    // Razorpay requires amounts in smaller units (Paise for INR, so multiply by 100)
    // Assuming amount is stored in standard units (like Rupees/Dollars)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR", // Change to USD if needed, but INR is standard for Razorpay India
      receipt: `rcpt_${invoiceId.substring(0, 8)}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ success: true, orderId: order.id, amount: options.amount });
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ success: false, error: "Gateway error" }, { status: 500 });
  }
}