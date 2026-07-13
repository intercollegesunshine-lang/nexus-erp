import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic'; // Prevents Next.js from caching empty data

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch ALL students along with their fees and results
    const students = await prisma.studentProfile.findMany({
      include: {
        fees: true,
        results: true
      },
      orderBy: {
        firstName: 'asc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: students 
    });

  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch student database" }, 
      { status: 500 }
    );
  }
}