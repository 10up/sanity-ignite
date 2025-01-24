import * as v from 'valibot';

function createEnv<T extends v.ObjectEntries>(envSchema: T, env: NodeJS.ProcessEnv) {
  const schema = v.object(envSchema);
  return v.parse(schema, env);
}
export { createEnv };
