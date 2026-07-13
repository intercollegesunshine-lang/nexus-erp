import { NextResponse } from 'next/server';
// Ensure this points exactly to where your prisma client lives
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // 1. Check if the user is securely logged in using our custom authOptions
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access. Please log in." }, 
        { status: 401 }
      );
    }

    // 2. Fetch data specifically for the logged-in user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        studentProfile: {
          include: {
            fees: {
              where: { status: "PENDING" }
            },
            results: {
              orderBy: { createdAt: 'desc' },
              take: 3
            },
            attendance: true
          }
        }
      }
    });

    if (!user || !user.studentProfile) {
      return NextResponse.json(
        { success: false, error: "Student profile not found for this account." }, 
        { status: 404 }
      );
    }

    // 3. Return the secure data to the frontend
    return NextResponse.json({ 
      success: true, 
      data: user.studentProfile 
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard data" }, 
      { status: 500 }
    );
  }
}