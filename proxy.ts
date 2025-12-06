import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default function proxy(request: NextRequest) {
    const authCookie = request.cookies.get('auth');
    const { pathname } = request.nextUrl;

    // Protected routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/report')) {
        if (!authCookie) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Auth routes (redirect to dashboard if already logged in)
    if (pathname === '/login') {
        if (authCookie) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/report/:path*', '/login'],
};
