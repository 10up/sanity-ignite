import 'server-only';

import type { QueryParams } from 'next-sanity';
import type { ZodType, z } from 'zod';

import type { DynamicFetchOptions } from './live';
import { sanityFetch as liveFetch } from './live';

type SanityFetchOptions<T extends ZodType> = {
  query: string;
  params?: QueryParams;
  schema: T;
  /**
   * Semantic, webhook-driven revalidation tags (e.g. `sanity:type:article`,
   * `sanity:slug:my-post`). They are forwarded to `cacheTag()` so the
   * `/api/revalidate` webhook can purge this entry with `revalidateTag()`.
   */
  tags?: string[];
  bypassValidation?: boolean;
} & DynamicFetchOptions;

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
 * Zod-validating wrapper around the native Sanity Live `sanityFetch`.
 *
 * IMPORTANT — Cache Components contract:
 * This MUST be called from inside a `'use cache'` boundary (the "cached" layer
 * of the three-layer pattern). The underlying Live fetch calls `cacheTag()` and
 * `cacheLife()`, which throw outside `'use cache'`.
 *
 * `perspective` and `stega` are request-time values: resolve them OUTSIDE the
 * cache boundary with `getDynamicFetchOptions()` (or hardcode `'published'` /
 * `false` for always-public data) and pass them in as serializable props.
 *
 * The Zod `schema` is referenced from module scope by the calling cached
 * component, never passed across a cache boundary as an argument.
 */
export async function sanityFetch<T extends ZodType>({
  query,
  params,
  schema,
  tags,
  perspective,
  stega,
  bypassValidation = false,
}: SanityFetchOptions<T>): Promise<z.infer<T> | null> {
  const { data } = await liveFetch({ query, params, perspective, stega, tags });

  if (bypassValidation) {
    return data as z.infer<T> | null;
  }

  return validate(schema, data, '');
}
