import { describe, it, expect } from 'vitest';
import { isPalindrome } from './palindrome';

describe('isPalindrome', () => {
  it.each(['racecar', 'level', 'a', ''])(
    'returns true for palindromic input %j',
    (value) => {
      expect(isPalindrome(value)).toBe(true);
    },
  );

  it.each(['hello', 'Racecar', 'ab'])(
    // "Racecar" is included deliberately: the baseline is case-sensitive,
    // so it differs in case and is not a palindrome by this rule.
    'returns false for non-palindromic input %j',
    (value) => {
      expect(isPalindrome(value)).toBe(false);
    },
  );

  it('throws a TypeError for null/undefined input (failure path)', () => {
    // @ts-expect-error - intentionally passing an invalid value to test the guard
    expect(() => isPalindrome(null)).toThrow(TypeError);
    // @ts-expect-error - intentionally passing an invalid value to test the guard
    expect(() => isPalindrome(undefined)).toThrow(TypeError);
  });
});
