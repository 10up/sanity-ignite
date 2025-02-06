import * as v from 'valibot';

function createEnv<T extends v.ObjectEntries>(envSchema: T) {
  type EnvKeys = keyof typeof envSchema;
  const envObj: Partial<Record<EnvKeys, string>> = Object.keys(envSchema).reduce(
    (acc, key) => {
      if (key in process.env) {
        acc[key as EnvKeys] = process.env[key];
      }
      return acc;
    },
    {} as Partial<Record<EnvKeys, string>>,
  );

  const schema = v.object(envSchema);
  return v.parse(schema, envObj);
}
export { createEnv };
