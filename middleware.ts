import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = { 
  // Added /payments to the protected routes!
  matcher: ["/", "/academics/:path*", "/fees/:path*", "/admin/:path*", "/payments/:path*"] 
};