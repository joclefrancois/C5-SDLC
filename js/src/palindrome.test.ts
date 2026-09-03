import { describe, it, expect } from 'vitest';
import { isPalindrome } from './palindrome';

describe('isPalindrome', () => {
  it.each([
    'racecar',
    'level',
    'a',
    '',
    'Racecar', // case-insensitive now: differs only in case, so it IS a palindrome
    'A man, a plan, a canal: Panama',
    'Was it a car or a cat I saw?',
  ])('returns true for palindromic input %j', (value) => {
    expect(isPalindrome(value)).toBe(true);
  });

  it.each(['hello', 'ab'])(
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
