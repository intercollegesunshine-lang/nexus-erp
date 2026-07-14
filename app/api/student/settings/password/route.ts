import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  console.log("=== API: PASSWORD UPDATE REQUEST RECEIVED ===");
  
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();
    console.log("API Body received:", { currentPassword: "***", newPassword: "***" });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      console.log("Password verification failed!");
      return NextResponse.json({ success: false, error: "Incorrect current password" }, { status: 403 });
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    console.log("Password verified. Hashing new password...");

    // Update in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { passwordHash: newPasswordHash }
    });

    console.log("UPDATED USER HASH:", updatedUser.passwordHash);
    console.log("=== API: PASSWORD UPDATED SUCCESSFULLY! ===");

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Password update error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}