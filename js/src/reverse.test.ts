import { describe, it, expect } from 'vitest';
import { reverse } from './reverse';

describe('reverse', () => {
  it.each([
    ['hello', 'olleh'],
    ['hello world', 'dlrow olleh'], // sentence with whitespace
    ['a', 'a'], // edge case: single character
    ['', ''], // edge case: empty string
  ])('reverses %j to %j', (value, expected) => {
    expect(reverse(value)).toBe(expected);
  });

  it('throws a TypeError for null/undefined input (failure path)', () => {
    // @ts-expect-error - intentionally passing an invalid value to test the guard
    expect(() => reverse(null)).toThrow(TypeError);
    // @ts-expect-error - intentionally passing an invalid value to test the guard
    expect(() => reverse(undefined)).toThrow(TypeError);
  });
});
