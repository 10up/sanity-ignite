import {
  defineLive,
  type QueryParams,
  type DefinedSanityFetchType,
  type ClientReturn,
} from 'next-sanity';
import { client } from './client';
import { serverEnv } from '@/env/serverEnv';

type SanityCachedFetchType = <const QueryString extends string>(options: {
  query: QueryString;
  params?: QueryParams | Promise<QueryParams>;
  revalidate?: number | false;
  stega?: boolean;
  tags?: string[]; // TODO: type tags
}) => Promise<{
  data: ClientReturn<QueryString>;
}>;

/**
 * Use the cached fetch function if you want to cache the requests and then revalidate them based on the tags.
 * You can use a webhook to trigger the revalidation or you can use the live client to listen for events and then revalidate the content.
 * Learn mode: https://github.com/sanity-io/next-sanity/tree/main/packages/next-sanity#sanityfetch-helper-function.
 */
const sanityCachedFetch: SanityCachedFetchType = async ({
  query,
  params = {},
  revalidate = 60, // default revalidation time in seconds
  stega,
  tags = [],
}) => {
  const data = await client.withConfig({ useCdn: false }).fetch(query, params, {
    stega,
    next: {
      revalidate: tags.length ? false : revalidate, // for simple, time-based revalidation. revalidate = false caches the content indefinitely
      tags, // revalidate the content based on the tags
    },
  });
  return { data };
};

/**
 * Use defineLive to enable automatic revalidation and refreshing of your fetched content
 * Learn more: https://github.com/sanity-io/next-sanity?tab=readme-ov-file#1-configure-definelive
 */
const { sanityFetch: sanityLiveFetch, SanityLive } = defineLive({
  client,
  // Required for showing draft content when the Sanity Presentation Tool is used, or to enable the Vercel Toolbar Edit Mode
  serverToken: serverEnv.SANITY_API_READ_TOKEN,
  // Required for stand-alone live previews, the token is only shared to the browser if it's a valid Next.js Draft Mode session
  browserToken: serverEnv.SANITY_API_READ_TOKEN,
});

type LiveFetchType = Parameters<DefinedSanityFetchType>[0] & {
  live: true;
};

type CachedFetchType = Parameters<SanityCachedFetchType>[0] & {
  live: false;
};

type FetchType = LiveFetchType | CachedFetchType;

/**
 * Fetch wrapper used to query data from Sanity. It narrows down the type according to the "live" argument you provide.
 * @param args -
 * @returns - queried data
 */
async function fetch(args: FetchType) {
  const { live, query, params, stega } = args;

  if (live) {
    return sanityLiveFetch({ query, params, stega });
  }

  const { data } = await sanityCachedFetch({
    query,
    params,
    stega,
    revalidate: args.revalidate,
    tags: args.tags,
  });

  return { data };
}

export type { FetchType };
export { SanityLive, fetch };
