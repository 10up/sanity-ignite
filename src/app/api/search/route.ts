import { type NextRequest, NextResponse } from 'next/server';
import { isSameOrigin } from '@/lib/http/sameOrigin';
import { sanityFetch } from '@/lib/sanity/client/fetch';
import { searchArticlesQuery } from '@/lib/sanity/queries/queries';
import { searchResultsSchema } from '@/lib/sanity/queries/schemas';

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

  const results = await sanityFetch({
    query: searchArticlesQuery,
    params: { searchTerm },
    schema: searchResultsSchema,
    cache: { profile: 'hours', tags: ['sanity:type:article'] },
    bypassLiveFetch: true,
  });

  return NextResponse.json({ results: results ?? [] });
}
