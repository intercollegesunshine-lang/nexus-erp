import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';
import bcrypt from 'bcryptjs';

// Force dynamic execution so Vercel doesn't crash during build
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Extract the file from the incoming FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    // 2. Convert the File to a Buffer so the 'xlsx' library can read it
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0]; // Read the first tab
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert rows to JSON

    let createdCount = 0;
    
    // 3. Process each row in the Excel sheet
    for (const row of jsonData as any[]) {
      // Must have at least an email and roll number to create an account
      if (!row.email || !row.rollNo) continue; 

      // STEP A: Find or Create the Class (e.g., "10-A")
      let targetClass = null;
      if (row.className) {
        targetClass = await (prisma as any).class.upsert({
          where: { name: String(row.className) },
          update: {},
          create: { name: String(row.className) }
        });
      }

      // NEW: Read the unique password from the Excel 'Password' column
      // If the cell is empty, it falls back to 'nexus123'
      const plainPassword = row.Password ? String(row.Password) : 'nexus123';
      const uniquePasswordHash = await bcrypt.hash(plainPassword, 10);

      // STEP B: Create the User and Student Profile together
      // Using 'upsert' prevents the database from crashing if you upload the same Excel file twice
      await prisma.user.upsert({
        where: { email: String(row.email) },
        update: {}, // Do nothing if the user already exists
        create: {
          email: String(row.email),
          passwordHash: uniquePasswordHash, // USING THE UNIQUE EXCEL PASSWORD
          role: row.Role ? String(row.Role).toUpperCase() : 'STUDENT', // Reads 'Role' from Excel, defaults to 'STUDENT'
          studentProfile: {
            create: {
              enrollmentNo: String(row.rollNo),
              firstName: String(row.firstName || 'Unknown'),
              lastName: String(row.lastName || ''),
              fatherName: row['Father Name'] ? String(row['Father Name']) : null, // NEW: Reads Father Name
              motherName: row['Mother Name'] ? String(row['Mother Name']) : null, // NEW: Reads Mother Name
              dateOfBirth: row.dateOfBirth ? new Date(row.dateOfBirth) : new Date('2010-01-01'),
              gradeLevel: String(row.gradeLevel || '10th'),
              section: String(row.section || 'A'),
              ...(targetClass?.id && {
                class: {
                  connect: { id: targetClass.id }
                }
              })
            }
          }
        }
      });
      createdCount++;
    }

    return NextResponse.json({ success: true, count: createdCount });
  } catch (error: any) {
    console.error("Bulk upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}