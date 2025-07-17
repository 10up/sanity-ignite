import * as v from 'valibot';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createEnv } from '../createEnv';

describe('createEnv', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should correctly extract and validate environment variables', () => {
    process.env.TEST_VAR = 'value';

    const schema = {
      TEST_VAR: v.string(),
    };

    const result = createEnv(schema);
    expect(result).toEqual({ TEST_VAR: 'value' });
  });

  it('should throw an error if process is not available', () => {
    const originalProcess = global.process;
    // @ts-ignore
    delete global.process;

    const schema = {
      TEST_VAR: v.string(),
    };

    expect(() => createEnv(schema)).toThrow(
      'process is not available. This function should run in a Node.js environment.',
    );

    global.process = originalProcess;
  });

  it('should throw an error if an environment variable is missing', () => {
    delete process.env.MISSING_VAR;

    const schema = {
      MISSING_VAR: v.string(),
    };

    expect(() => createEnv(schema)).toThrow();
  });

  it('should throw an error if an environment variable does not match the schema', () => {
    process.env.NUMBER_VAR = 'not-a-number';

    const schema = {
      NUMBER_VAR: v.number(),
    };

    expect(() => createEnv(schema)).toThrow();
  });
});
