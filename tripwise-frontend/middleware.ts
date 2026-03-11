import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {

    const isLoggedIn = request.cookies.get('is_logged_in')?.value;

    const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';

    // 1. Non-authenticated users trying to access protected routes should be redirected to the login page
    if (!isLoggedIn && !isAuthPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // 2. Authenticated users trying to access login/register pages should be redirected to the home page
    if (isLoggedIn && isAuthPage) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Apply this middleware to all routes except API routes, Next.js static files, and favicon
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};