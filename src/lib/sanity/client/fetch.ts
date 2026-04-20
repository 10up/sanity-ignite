import 'server-only';

import { cacheLife, cacheTag } from 'next/cache';
import { draftMode } from 'next/headers';
import type { QueryParams } from 'next-sanity';
import type { ZodType, z } from 'zod';

import { client } from './client';
import { sanityFetch as liveFetch } from './live';

type SanityFetchOptions<T extends ZodType> = {
  query: string;
  params?: QueryParams;
  schema: T;
  cache?: {
    profile?: string;
    tags?: string[];
  };
};

async function cachedFetch(
  query: string,
  params: QueryParams | undefined,
  profile: string,
  tags: string[]
): Promise<unknown> {
  'use cache';

  cacheLife(profile);
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
    console.error(
      `[sanityFetch${label}] Zod validation failed:`,
      parsed.error.flatten()
    );
    return null;
  }

  return parsed.data;
}

export async function sanityFetch<T extends ZodType>({
  query,
  params,
  schema,
  cache,
}: SanityFetchOptions<T>): Promise<z.infer<T> | null> {
  const { isEnabled: isDraft } = await draftMode();

  if (isDraft) {
    const { data } = await liveFetch({ query, params });
    return validate(schema, data, ':draft');
  }

  const data = await cachedFetch(
    query,
    params,
    cache?.profile ?? 'hours',
    cache?.tags ?? []
  );

  return validate(schema, data, '');
}
