import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { draftMode } from 'next/headers';
import type { QueryParams } from 'next-sanity';
import type { ZodType, z } from 'zod';

import { client } from './client';
import { sanityFetch as liveFetch } from './live';

export const CACHE_PROFILES = {
  default: { stale: 300, revalidate: 900 },
  seconds: { stale: 30, revalidate: 1, expire: 60 },
  minutes: { stale: 300, revalidate: 60, expire: 3600 },
  hours: { stale: 300, revalidate: 3600, expire: 86400 },
  days: { stale: 300, revalidate: 86400, expire: 604800 },
  weeks: { stale: 300, revalidate: 604800, expire: 2592000 },
  max: { stale: 300, revalidate: 2592000, expire: 31536000 },
} as const;

export type CacheProfile = keyof typeof CACHE_PROFILES;

type SanityFetchOptions<T extends ZodType> = {
  query: string;
  params?: QueryParams;
  schema: T;
  cache?: {
    profile?: CacheProfile;
    tags?: string[];
  };
  bypassLiveFetch?: boolean;
  bypassValidation?: boolean;
};

async function cachedFetch(
  query: string,
  params: QueryParams | undefined,
  profile: CacheProfile,
  tags: string[]
): Promise<unknown> {
  'use cache';

  cacheLife(CACHE_PROFILES[profile]);
  for (const tag of tags) {
    cacheTag(tag);
  }

  return client.fetch(query, params ?? {});
}

function validate<T extends ZodType>(
  schema: T,
  data: unknown,
  label: string
): z.infer<T> | null {
  if (!data) return null;

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    console.error(`[sanityFetch${label}] Zod validation failed:`, parsed.error);
    return null;
  }

  return parsed.data;
}

/**
 * The primary Sanity fetch client for Server Components.
 *
 * Returns the `previewDrafts` perspective when Draft Mode is on (so editors
 * see their in-progress content in the Presentation tool) and the cached
 * `published` perspective otherwise. Results are validated against the
 * provided Zod schema.
 *
 * Call this from any Server Component
 * */
export async function sanityFetch<T extends ZodType>({
  query,
  params,
  schema,
  cache,
  bypassLiveFetch = false,
  bypassValidation = false,
}: SanityFetchOptions<T>): Promise<z.infer<T> | null> {
  if (!bypassLiveFetch) {
    const { isEnabled: isDraft } = await draftMode();
    if (isDraft) {
      const { data } = await liveFetch({ query, params });
      return validate(schema, data, ':draft');
    }
  }

  const data = await cachedFetch(
    query,
    params,
    cache?.profile ?? 'hours',
    cache?.tags ?? []
  );
  if (!bypassValidation) {
    return validate(schema, data, '');
  }
  return data as z.infer<T> | null;
}
