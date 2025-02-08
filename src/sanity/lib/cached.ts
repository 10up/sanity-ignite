import { type QueryParams } from 'next-sanity';
import { client } from './client';

/**
 * Use this helper fetch function if you want to cache the requests and then revalidate them based on the tags.
 * You can use a webhook to trigger the revalidation or you can use the live client to listen for events and then revalidate the content.
 * You can find an example of how to cache and revalidate the content in the
 * [next-sanity package: https://github.com/sanity-io/next-sanity/tree/main/packages/next-sanity#sanityfetch-helper-function).
 *
 * If you plan to have the content being live updated on the frontend, then use the sanityLiveFetch function instead.
 */
export async function sanityCachedFetch<const QueryString extends string>({
  query,
  params = {},
  tags = [],
}: {
  query: QueryString;
  params?: QueryParams;
  tags?: string[];
}) {
  const data = await client.withConfig({ useCdn: false }).fetch(query, params, {
    next: {
      revalidate: false, // cache it indefinitely
      tags, // revalidate the content based on the tags
    },
  });

  return { data };
}
