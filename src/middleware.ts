// pages/_middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import nookies from 'nookies';

export function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const token = req.cookies.get('authToken')?.value || null;  

  

  if (url.pathname.startsWith('/categories')) {
    if (!token) {
      // Redirect to login page if access_token is not present
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Allow request to proceed for other pages
  return NextResponse.next();
}
