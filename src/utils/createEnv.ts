import { z } from 'zod';

function createEnv<T extends z.ZodRawShape>(envSchema: T) {
  if (typeof process === 'undefined') {
    throw new Error(
      'process is not available. This function should run in a Node.js environment.'
    );
  }

  type EnvKeys = keyof T;
  const envObj: Partial<Record<EnvKeys, string>> = Object.keys(
    envSchema
  ).reduce(
    (acc, key) => {
      if (key in process.env) {
        acc[key as EnvKeys] = process.env[key];
      }
      return acc;
    },
    {} as Partial<Record<EnvKeys, string>>
  );

  const schema = z.object(envSchema);
  return schema.parse(envObj);
}
export { createEnv };
