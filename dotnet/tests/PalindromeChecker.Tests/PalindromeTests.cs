using System;
using PalindromeChecker;
using Xunit;

namespace PalindromeChecker.Tests;

public class PalindromeTests
{
    private readonly Palindrome _sut = new();

    [Theory]
    [InlineData("racecar")]
    [InlineData("level")]
    [InlineData("a")]      // edge case: single character
    [InlineData("")]       // edge case: empty string
    public void IsPalindrome_PalindromicInput_ReturnsTrue(string value)
    {
        Assert.True(_sut.IsPalindrome(value));
    }

    [Theory]
    [InlineData("hello")]
    [InlineData("Racecar")] // baseline is case-sensitive: differs in case, so not a palindrome by this rule
    [InlineData("ab")]
    public void IsPalindrome_NonPalindromicInput_ReturnsFalse(string value)
    {
        Assert.False(_sut.IsPalindrome(value));
    }

    [Fact]
    public void IsPalindrome_NullInput_ThrowsArgumentNullException()
    {
        // failure path
        Assert.Throws<ArgumentNullException>(() => _sut.IsPalindrome(null!));
    }
}
