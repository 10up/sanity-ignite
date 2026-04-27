import { type NextRequest, NextResponse } from 'next/server';

const COUNTRY_COOKIE = 'x-user-country';

export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  const country = request.headers.get('x-vercel-ip-country') ?? 'US';

  response.cookies.set(COUNTRY_COOKIE, country, {
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    // 1 day — refreshed on every request so it stays current
    maxAge: 60 * 60 * 24,
  });

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals and static assets
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
