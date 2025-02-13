import { createClient } from 'next-sanity';
import { clientEnv } from '@/env/clientEnv';

export const client = createClient({
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: clientEnv.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: true,
  perspective: 'published',
  stega: {
    studioUrl: clientEnv.NEXT_PUBLIC_SANITY_STUDIO_URL,
    // Set logger to 'console' for more verbose logging
    // logger: console,
    filter: (props) => {
      if (props.sourcePath.at(-1) === 'title') {
        return true;
      }
      return props.filterDefault(props);
    },
  },
});
