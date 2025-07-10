import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { serverEnv } from '@/env/serverEnv';
import { client } from '@/lib/sanity/client/client';

/**
 * defineEnableDraftMode() is used to enable draft mode. Set the route of this file
 * as the previewMode.enable option for presentationTool in your sanity.config.ts
 * Learn more: https://github.com/sanity-io/next-sanity?tab=readme-ov-file#5-integrating-with-sanity-presentation-tool--visual-editing
 */

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: serverEnv.SANITY_API_READ_TOKEN }),
});
