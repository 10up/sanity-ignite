import { createEnv } from '@/utils/createEnv';
import * as v from 'valibot';

const envSchema = {
  NEXT_PUBLIC_SANITY_PROJECT_ID: v.pipe(v.string(), v.minLength(1)),
  NEXT_PUBLIC_SANITY_DATASET: v.pipe(v.string(), v.minLength(1)),
  NEXT_PUBLIC_SANITY_API_VERSION: v.pipe(v.string(), v.minLength(1)),
  NEXT_PUBLIC_SANITY_STUDIO_URL: v.pipe(v.string(), v.url()),
};
const clientEnv = createEnv(envSchema);
export { clientEnv };
