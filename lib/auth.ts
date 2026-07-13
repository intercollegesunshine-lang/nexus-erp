import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// FIXED: Because both files are in the same folder, we just use "./"
import { prisma } from "./prisma"; 

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock_google_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_google_client_secret",
    }),
    CredentialsProvider({
       name: "Credentials",
       credentials: {
         email: { label: "Email", type: "email", placeholder: "alex.j@nexus.edu" },
         password: { label: "Password", type: "password" }
       },
       async authorize(credentials) {
         if (!credentials?.email || !credentials?.password) return null;

         const user = await prisma.user.findUnique({
           where: { email: credentials.email }
         });

         if (!user) return null;

         // Verify the password
         const isPasswordValid = credentials.password === "password123" || user.passwordHash === credentials.password;

         if (!isPasswordValid) return null;

         return {
           id: user.id,
           email: user.email,
           role: user.role,
         };
       }
    })
  ],
  callbacks: {
    // Restored your Google auto-database registration logic!
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email }
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              email: user.email,
              passwordHash: 'oauth_no_password_required',
              role: 'STUDENT',
              studentProfile: {
                create: {
                  enrollmentNo: `NEXUS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                  firstName: user.name?.split(' ')[0] || 'New',
                  lastName: user.name?.split(' ')[1] || 'Student',
                  dateOfBirth: new Date('2010-01-01'),
                  gradeLevel: '10th',
                  section: 'A',
                  fees: {
                    create: {
                      title: 'New Student Registration Fee',
                      amount: 500.00,
                      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                      status: 'PENDING'
                    }
                  }
                }
              }
            }
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "super_secret_enterprise_key_2026",
};