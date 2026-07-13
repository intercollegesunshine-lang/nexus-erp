import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // 1. Create a core User account for the student
  const user = await prisma.user.upsert({
    where: { email: 'alex.j@nexus.edu' },
    update: {},
    create: {
      email: 'alex.j@nexus.edu',
      passwordHash: 'hashed_password_placeholder', // In a real app, use bcrypt here
      role: 'STUDENT',
    },
  });

  // 2. Create the Student Profile linked to the user
  const student = await prisma.studentProfile.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      enrollmentNo: 'NEXUS-2026-001',
      firstName: 'Alex',
      lastName: 'Johnson',
      dateOfBirth: new Date('2010-05-15'),
      bloodGroup: 'O+',
      gradeLevel: '10th',
      section: 'A',
      
      // 3. Create a Fee Invoice at the same time
      fees: {
        create: {
          title: 'Term 1 Tuition Fee',
          amount: 2500.00,
          dueDate: new Date('2026-08-01'),
          status: 'PENDING',
        }
      },

      // 4. Create Exam Results at the same time
      results: {
        create: [
          {
            examName: 'Mid-Term 2026',
            subject: 'Computer Science',
            marksObtained: 98,
            totalMarks: 100,
            grade: 'A+',
          },
          {
            examName: 'Mid-Term 2026',
            subject: 'Advanced Physics',
            marksObtained: 85,
            totalMarks: 100,
            grade: 'B+',
          }
        ]
      }
    },
  });

  console.log("✅ Seeding completed successfully!");
  console.log(`Created Student: ${student.firstName} ${student.lastName}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });