import NextAuth from "next-auth";
// Change to (Correct):
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth"; // Point to your library file

const handler = NextAuth(authOptions);

// Only export the handler functions
export { handler as GET, handler as POST };