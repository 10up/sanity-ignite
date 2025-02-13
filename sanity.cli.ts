/**
 * Sanity CLI Configuration
 * This file configures the Sanity CLI tool with project-specific settings
 * and customizes the Vite bundler configuration.
 * Learn more: https://www.sanity.io/docs/cli
 */

import { defineCliConfig } from 'sanity/cli';
import { clientEnv } from '@/env/clientEnv';

export default defineCliConfig({
  api: {
    projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
  },
});
