// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
const authRoutes = ['/login', '/register'];
const protectedRoutes = ['/', '/dashboard', '/profile', '/settings'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;
  const isPublicRoute = publicRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  console.log("token is ",token)

  // 1. Redirect authenticated users away from auth routes
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. Protect routes that require authentication
  if (!token && isProtectedRoute) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Add security headers to all responses
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CSP Header (adjust based on your needs)
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'"
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|api/auth|images|icons|fonts).*)',
  ],
};