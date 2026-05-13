import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Middleware runs on every matched route.
 * - Protects /dashboard routes (any authenticated user)
 * - Protects /admin routes (admin role only)
 * - Redirects authenticated users away from /login and /register
 */
export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname }    = req.nextUrl;
    const token           = req.nextauth.token;
    const isAuthenticated = !!token;

    /* ── Redirect logged-in users away from auth pages ── */
    if (isAuthenticated && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    /* ── Admin-only guard ──────────────────────────────── */
    if (pathname.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      /* Only trigger middleware for protected routes */
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    /*
     * Exclude:
     * - _next/static, _next/image
     * - favicon.ico
     * - public files
     * - api routes (handled individually)
     */
  ],
};
