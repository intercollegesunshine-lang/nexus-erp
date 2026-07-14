import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Force dynamic execution so Vercel doesn't crash during build
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Extract the student details from the request
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      rollNo, 
      gradeLevel, 
      section, 
      className 
    } = body;

    // Basic validation
    if (!email || !rollNo || !firstName) {
      return NextResponse.json(
        { success: false, error: "First Name, Email, and Roll Number are required." }, 
        { status: 400 }
      );
    }

    // Hash the provided password, or use a default one if left blank
    const passwordHash = await bcrypt.hash(password || 'nexus123', 10);

    // STEP A: Find or Create the Class (e.g., "10-A")
    let targetClass = null;
    if (className) {
      targetClass = await (prisma as any).class.upsert({
        where: { name: String(className) },
        update: {},
        create: { name: String(className) }
      });
    }

    // STEP B: Create the User and Student Profile together
    // Here we use `create` instead of `upsert` so it fails gracefully if the email is already taken
    const newUser = await prisma.user.create({
      data: {
        email: String(email),
        passwordHash,
        role: 'STUDENT',
        studentProfile: {
          create: {
            enrollmentNo: String(rollNo),
            firstName: String(firstName),
            lastName: String(lastName || ''),
            dateOfBirth: new Date('2010-01-01'), // Default placeholder
            gradeLevel: String(gradeLevel || '10th'),
            section: String(section || 'A'),
            // Use Prisma's relational connect syntax
            ...(targetClass?.id && {
              class: {
                connect: { id: targetClass.id }
              }
            })
          }
        }
      }
    });

    return NextResponse.json({ success: true, message: "Student created successfully!" });
  } catch (error: any) {
    console.error("Manual student creation error:", error);
    
    // Handle unique constraint errors (e.g., email or rollNo already exists)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: "A student with this Email or Roll Number already exists." }, 
        { status: 409 }
      );
    }

    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
