import { defineLive } from 'next-sanity/live';
import { serverEnv } from '@/env/serverEnv';
import { client } from './client';

// browserToken is only sent to the client when draftMode().isEnabled is true
// (enforced inside defineLive). In production, no token reaches the browser
// and no WebSocket connection is established.
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: serverEnv.SANITY_API_READ_TOKEN,
  browserToken: serverEnv.SANITY_API_READ_TOKEN,
});
