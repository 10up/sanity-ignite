import 'server-only';

import { createEnv } from '@/utils/createEnv';
import * as v from 'valibot';

const envSchema = {
  SANITY_API_READ_TOKEN: v.pipe(v.string(), v.minLength(1)),
};
const serverEnv = createEnv(envSchema);
export { serverEnv };
