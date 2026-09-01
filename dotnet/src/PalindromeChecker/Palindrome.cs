using System;

namespace PalindromeChecker;

/// <summary>
/// Checks whether a string reads the same forwards and backwards.
///
/// Baseline (Story 1): exact, case-sensitive comparison — no punctuation
/// or whitespace normalization. Story 2 in this PoC's demo asks for
/// punctuation/whitespace/case-insensitive matching (e.g. "A man, a
/// plan, a canal: Panama") — that's an intentional gap in this baseline,
/// left open so the demo can show the "modify an existing class" flow
/// live. See the repo README for the walkthrough.
/// </summary>
public class Palindrome
{
    /// <summary>
    /// Returns true if <paramref name="value"/> reads the same forwards
    /// and backwards, using an exact, case-sensitive character comparison.
    /// </summary>
    /// <exception cref="ArgumentNullException">
    /// Thrown when <paramref name="value"/> is null.
    /// </exception>
    public bool IsPalindrome(string value)
    {
        if (value is null)
        {
            throw new ArgumentNullException(nameof(value));
        }

        int left = 0;
        int right = value.Length - 1;

        while (left < right)
        {
            if (value[left] != value[right])
            {
                return false;
            }

            left++;
            right--;
        }

        return true;
    }
}
