import { describe, expect, it } from 'vitest';
import { assertValue } from '../assertValue';

describe('assertValue', () => {
  it('should return the value if it is not undefined', () => {
    expect(assertValue(42, 'Value is required')).toBe(42);
    expect(assertValue('hello', 'Value is required')).toBe('hello');
    expect(assertValue(true, 'Value is required')).toBe(true);
  });

  it('should throw an error if the value is undefined', () => {
    expect(() => assertValue(undefined, 'Value is required')).toThrow('Value is required');
  });
});
