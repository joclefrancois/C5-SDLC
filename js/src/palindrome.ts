/**
 * Checks whether a string reads the same forwards and backwards,
 * ignoring case, spaces, and punctuation.
 *
 * @throws {TypeError} if `value` is null or undefined.
 */
export function isPalindrome(value: string): boolean {
  if (value === null || value === undefined) {
    throw new TypeError('isPalindrome: value must not be null or undefined');
  }

  const normalized = value.toLowerCase().replace(/[^a-z0-9]/g, '');

  let left = 0;
  let right = normalized.length - 1;

  while (left < right) {
    if (normalized[left] !== normalized[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}

/**
 * Checks whether a string reads the same forwards and backwards. When
 * `caseSensitive` is true, this reproduces the original Story 1
 * behavior (exact, case-sensitive, no punctuation/whitespace
 * normalization) for callers that still depend on it.
 *
 * @throws {TypeError} if `value` is null or undefined.
 */
export function isPalindromeWithOptions(value: string, caseSensitive: boolean): boolean {
  if (value === null || value === undefined) {
    throw new TypeError('isPalindromeWithOptions: value must not be null or undefined');
  }

  if (!caseSensitive) {
    return isPalindrome(value);
  }

  let left = 0;
  let right = value.length - 1;

  while (left < right) {
    if (value[left] !== value[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}
