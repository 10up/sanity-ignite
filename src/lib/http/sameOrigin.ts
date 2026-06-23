import type { NextRequest } from 'next/server';

/**
 * Same-origin guard for route handlers.
 *
 * The primary signal is `Sec-Fetch-Site`: browsers send it on every request and
 * JS cannot forge it, so this reliably blocks other sites from calling the
 * route from a browser. It does NOT stop a scripted client (curl/node) that sets
 * headers manually — pair it with rate limiting for that.
 */
export function isSameOrigin(request: NextRequest): boolean {
  const secFetchSite = request.headers.get('sec-fetch-site');
  if (secFetchSite) {
    return secFetchSite === 'same-origin';
  }
  // Fallback for clients that omit Sec-Fetch-* : compare Origin to our host.
  return request.headers.get('origin') === request.nextUrl.origin;
}
