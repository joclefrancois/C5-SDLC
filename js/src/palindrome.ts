/**
 * Checks whether a string reads the same forwards and backwards.
 *
 * Baseline (Story 1): exact, case-sensitive comparison — no punctuation
 * or whitespace normalization. Story 2 in this PoC's demo asks for
 * punctuation/whitespace/case-insensitive matching (e.g. "A man, a
 * plan, a canal: Panama") — that's an intentional gap in this baseline,
 * left open so the demo can show the "modify an existing module" flow
 * live. See the repo README for the walkthrough.
 *
 * @throws {TypeError} if `value` is null or undefined.
 */
export function isPalindrome(value: string): boolean {
  if (value === null || value === undefined) {
    throw new TypeError('isPalindrome: value must not be null or undefined');
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
