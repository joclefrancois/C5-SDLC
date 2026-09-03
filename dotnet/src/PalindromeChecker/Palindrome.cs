using System;
using System.Linq;

namespace PalindromeChecker;

/// <summary>
/// Checks whether a string reads the same forwards and backwards,
/// ignoring case, spaces, and punctuation.
/// </summary>
public class Palindrome
{
    /// <summary>
    /// Returns true if <paramref name="value"/> reads the same forwards
    /// and backwards, comparing only alphanumeric characters and
    /// ignoring case.
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

        string normalized = new string(value.Where(char.IsLetterOrDigit).ToArray()).ToLowerInvariant();

        int left = 0;
        int right = normalized.Length - 1;

        while (left < right)
        {
            if (normalized[left] != normalized[right])
            {
                return false;
            }

            left++;
            right--;
        }

        return true;
    }
}
