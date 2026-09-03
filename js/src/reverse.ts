/**
 * Reverses the characters of a string or sentence.
 *
 * @throws {TypeError} if `value` is null or undefined.
 */
export function reverse(value: string): string {
  if (value === null || value === undefined) {
    throw new TypeError('reverse: value must not be null or undefined');
  }

  return value.split('').reverse().join('');
}
