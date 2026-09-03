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
