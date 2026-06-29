import { type NextRequest, NextResponse } from 'next/server';
import { isSameOrigin } from '@/lib/http/sameOrigin';
import { searchArticles } from '@/lib/sanity/client/search';

// Search is an idempotent read, so it lives in a GET route handler rather than a
// Server Action: it's cacheable per query, debounce-friendly, and the client can
// cancel stale in-flight requests with an AbortController as the user types.
const MIN_QUERY_LENGTH = 2;

export async function GET(request: NextRequest) {
  if (!isSameOrigin(request)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const searchTerm = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (searchTerm.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchArticles(searchTerm);

  return NextResponse.json({ results: results ?? [] });
}
