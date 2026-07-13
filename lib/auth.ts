import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma"; // Adjust this path if needed to find your prisma client

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
       name: "Credentials",
       credentials: {
         email: { label: "Email", type: "email" },
         password: { label: "Password", type: "password" }
       },
       async authorize(credentials) {
         // Your logic here
         return null; 
       }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
};