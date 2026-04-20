import { defineCliConfig } from 'sanity/cli';
import { clientEnv } from '@/env/clientEnv';

export default defineCliConfig({
  api: {
    projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
  },
  typegen: {
    enabled: true,
    path: ['./src/lib/sanity/queries/*.ts'],
    schema: './.sanity/schema.json',
    generates: './.sanity/sanity.types.ts',
    overloadClientMethods: true,
  },
});
