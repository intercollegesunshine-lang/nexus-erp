import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// EDIT STUDENT DETAILS
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const studentId = params.id;
    const body = await request.json();
    
    const { firstName, lastName, enrollmentNo, gradeLevel, section } = body;

    const updatedStudent = await prisma.studentProfile.update({
      where: { id: studentId },
      data: {
        firstName: String(firstName),
        lastName: String(lastName),
        enrollmentNo: String(enrollmentNo),
        gradeLevel: String(gradeLevel),
        section: String(section),
      }
    });

    return NextResponse.json({ success: true, data: updatedStudent });
  } catch (error: any) {
    console.error("Failed to update student:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE STUDENT
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const studentId = params.id;

    // 1. Find the student to get their User ID
    const student = await prisma.studentProfile.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
    }

    // 2. Delete the base User account. 
    // Because we used `onDelete: Cascade` in the schema, this will automatically 
    // delete the StudentProfile, Fees, Results, and Attendance in one clean sweep!
    await prisma.user.delete({
      where: { id: student.userId }
    });

    return NextResponse.json({ success: true, message: "Student completely removed from system" });
  } catch (error: any) {
    console.error("Failed to delete student:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}