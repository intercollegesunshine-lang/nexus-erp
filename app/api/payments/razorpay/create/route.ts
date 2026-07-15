import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Razorpay from 'razorpay';

export const dynamic = 'force-dynamic';

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

    // FIXED: Initialize Razorpay INSIDE the function to prevent Vercel build crashes!
    // We also provide a fallback placeholder so it never crashes if the env variable is delayed.
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "placeholder_id",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "placeholder_secret",
    });

    // Razorpay requires amounts in smaller units (Paise for INR, so multiply by 100)
    const amountInPaise = Math.round(amount * 100);

    const options = {
      amount: amountInPaise,
      currency: "INR", 
      receipt: `rcpt_${invoiceId.substring(0, 8)}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ success: true, orderId: order.id, amount: options.amount });
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ success: false, error: "Gateway error" }, { status: 500 });
  }
}