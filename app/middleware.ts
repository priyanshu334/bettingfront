// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;
  const isLoginPage = pathname === '/login';

  // If NOT logged in and NOT on /login → redirect to /login
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If logged in and trying to access /login → redirect to /
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow access
  return NextResponse.next();
}

// ✅ Only allow login without auth
export const config = {
  matcher: ['/((?!_next|favicon.ico|.*\\.(png|jpg|jpeg|svg|js|css|webmanifest|json)).*)'],
};
