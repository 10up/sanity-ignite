import 'server-only';

import { z } from 'zod';
import { createEnv } from '@/utils/createEnv';

const envSchema = {
  SANITY_API_READ_TOKEN: z.string().min(1),
  MAX_STATIC_PARAMS: z
    .string()
    .transform((value) => Number.parseInt(value, 10))
    .pipe(z.number().min(1).max(1000)),
};
const serverEnv = createEnv(envSchema);
export { serverEnv };
