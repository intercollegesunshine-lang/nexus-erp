import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function DELETE(request: Request, { params }: { params: { type: string, id: string } }) {
  try {
    const { type, id } = params;

    if (!id || !type) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    // Determine which table to delete from based on the URL parameter
    switch (type) {
      case 'fee':
        await prisma.feeInvoice.delete({ where: { id } });
        break;
      case 'result':
        await prisma.examResult.delete({ where: { id } });
        break;
      case 'attendance':
        await prisma.attendance.delete({ where: { id } });
        break;
      case 'schedule':
        await prisma.schedule.delete({ where: { id } });
        break;
      default:
        return NextResponse.json({ success: false, error: "Invalid record type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Record deleted successfully" });
  } catch (error: any) {
    console.error(`Failed to delete ${params.type}:`, error);
    return NextResponse.json({ success: false, error: "Deletion failed. Record might not exist." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { type: string, id: string } }) {
  try {
    const { type, id } = params;
    const body = await request.json();

    if (!id || !type) {
      return NextResponse.json({ success: false, error: "Missing parameters" }, { status: 400 });
    }

    let updatedRecord;

    switch (type) {
      case 'fee':
        updatedRecord = await prisma.feeInvoice.update({
          where: { id },
          data: { 
            title: body.title, 
            amount: parseFloat(body.amount), 
            dueDate: new Date(body.dueDate), 
            status: body.status 
          }
        });
        break;
      case 'result':
        updatedRecord = await prisma.examResult.update({
          where: { id },
          data: { 
            examName: body.examName, 
            subject: body.subject, 
            marksObtained: parseFloat(body.marksObtained), 
            totalMarks: parseFloat(body.totalMarks), 
            grade: body.grade 
          }
        });
        break;
      case 'attendance':
        updatedRecord = await prisma.attendance.update({
          where: { id },
          data: { 
            date: new Date(body.date), 
            subject: body.subject, 
            status: body.status 
          }
        });
        break;
      default:
        return NextResponse.json({ success: false, error: "Invalid record type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: updatedRecord });
  } catch (error: any) {
    console.error(`Failed to update ${params.type}:`, error);
    return NextResponse.json({ success: false, error: "Update failed." }, { status: 500 });
  }
}