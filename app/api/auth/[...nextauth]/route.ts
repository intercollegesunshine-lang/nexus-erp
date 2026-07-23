import NextAuth from "next-auth";
// Make sure this path correctly points to where you saved auth.ts!
// If your auth.ts is in src/lib, this should be "@/lib/auth"
import { authOptions } from "@/lib/auth"; 

export const dynamic = 'force-dynamic';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };