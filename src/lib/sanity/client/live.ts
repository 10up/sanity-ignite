import { cookies, draftMode } from 'next/headers';
import {
  defineLive,
  type LivePerspective,
  resolvePerspectiveFromCookies,
} from 'next-sanity/live';
import { serverEnv } from '@/env/serverEnv';
import { client } from './client';

// `strict: true` makes `perspective` + `stega` required on every `sanityFetch`
// call and `includeDrafts` required on `<SanityLive />`. This is what lets
// Sanity Live work with Next.js Cache Components: request-time values are
// resolved OUTSIDE `'use cache'` boundaries (see `getDynamicFetchOptions`) and
// passed in as serializable props.
//
// browserToken is only sent to the client when `<SanityLive includeDrafts />`
// is rendered (draft mode). In production no token reaches the browser and no
// WebSocket connection is established.
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: serverEnv.SANITY_API_READ_TOKEN,
  browserToken: serverEnv.SANITY_API_READ_TOKEN,
  strict: true,
});

export type { LivePerspective };

/** Serializable request-time options every cached fetch needs. */
export interface DynamicFetchOptions {
  perspective: LivePerspective;
  stega: boolean;
}

/**
 * Resolves the perspective + stega settings for the current request.
 *
 * Reads `draftMode()` and `cookies()`, so it MUST be called outside any
 * `'use cache'` boundary (the "dynamic" layer of the three-layer pattern). The
 * resolved values are then passed as props into a cached component.
 */
export async function getDynamicFetchOptions(): Promise<DynamicFetchOptions> {
  const { isEnabled: isDraftMode } = await draftMode();
  if (!isDraftMode) {
    return { perspective: 'published', stega: false };
  }

  const jar = await cookies();
  const perspective = await resolvePerspectiveFromCookies({ cookies: jar });
  return { perspective: perspective ?? 'drafts', stega: true };
}
