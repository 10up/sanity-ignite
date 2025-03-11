import 'server-only';

import { createEnv } from '@/utils/createEnv';
import * as v from 'valibot';

const envSchema = {
  SANITY_API_READ_TOKEN: v.pipe(v.string(), v.minLength(1)),
  MAX_STATIC_PARAMS: v.pipe(
    v.string(),
    v.transform(parseInt),
    v.number(),
    v.minValue(1),
    v.maxValue(1000),
  ),
};
const serverEnv = createEnv(envSchema);
export { serverEnv };
