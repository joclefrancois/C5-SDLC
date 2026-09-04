using System;
using System.Text;

namespace PalindromeChecker;

/// <summary>
/// Reverses the characters of a string or sentence.
/// </summary>
public class Reverse
{
    /// <summary>
    /// Returns <paramref name="value"/> with its characters in reverse order.
    /// </summary>
    /// <exception cref="ArgumentNullException">
    /// Thrown when <paramref name="value"/> is null.
    /// </exception>
    public string Apply(string value)
    {
        if (value is null)
        {
            throw new ArgumentNullException(nameof(value));
        }

        var chars = value.ToCharArray();
        Array.Reverse(chars);
        return new string(chars);
    }
}
