import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    return NextResponse.next();
  }
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('token')?.value;

//   const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';

//   if (!token && !isAuthPage) {
//     // If the user is not authenticated and trying to access a protected page, redirect to login
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   if (token && isAuthPage) {
//     // If the user is authenticated and trying to access login/register, redirect to home
//     return NextResponse.redirect(new URL('/', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], 
// };