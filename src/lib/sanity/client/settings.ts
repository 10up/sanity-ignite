import 'server-only';

import { settingsQuery } from '../queries/queries';
import { settingsSchema } from '../queries/schemas';
import { sanityFetch } from './fetch';

/**
 * The global site name (Settings → Title), used as `og:site_name` on every
 * page. It's the same for everyone, so it lives in its own published, cached
 * boundary — call it from `generateMetadata` and pass the result to
 * `formatMetaData`.
 */
export async function fetchSiteName(): Promise<string | undefined> {
  'use cache';
  const settings = await sanityFetch({
    query: settingsQuery,
    schema: settingsSchema,
    tags: ['sanity:type:settings'],
    perspective: 'published',
    stega: false,
  });
  return settings?.title ?? undefined;
}
