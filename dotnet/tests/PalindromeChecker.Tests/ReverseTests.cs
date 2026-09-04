using System;
using PalindromeChecker;
using Xunit;

namespace PalindromeChecker.Tests;

public class ReverseTests
{
    private readonly Reverse _sut = new();

    [Theory]
    [InlineData("hello", "olleh")]
    [InlineData("hello world", "dlrow olleh")] // sentence with whitespace
    [InlineData("a", "a")]                     // edge case: single character
    [InlineData("", "")]                       // edge case: empty string
    public void Apply_GivenInput_ReturnsReversedString(string value, string expected)
    {
        Assert.Equal(expected, _sut.Apply(value));
    }

    [Fact]
    public void Apply_NullInput_ThrowsArgumentNullException()
    {
        // failure path
        Assert.Throws<ArgumentNullException>(() => _sut.Apply(null!));
    }
}
