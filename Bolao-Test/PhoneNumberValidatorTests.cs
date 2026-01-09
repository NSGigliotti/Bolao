using Bolao.Services;

namespace Bolao.Tests;

public class PhoneNumberValidatorTests
{
    [Fact]
    public void IsValidPhoneNumber_ComDDIeFormatacao_DeveRetornarVerdadeiro()
    {
        // Arrange
        string num = "+55 11 98765-4321";

        // Act
        bool result = PhoneNumberValidator.IsValidPhoneNumber(num);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsValidPhoneNumber_SemDDI_DeveRetornarVerdadeiro()
    {
        // Arrange
        string num = "+55 11 98765-4321";

        // Act
        bool result = PhoneNumberValidator.IsValidPhoneNumber(num);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public void IsValidPhoneNumber_MuitoLongo_DeveRetornarFalso()
    {
        // Arrange
        string num = "12345678901234567890";

        // Act
        bool result = PhoneNumberValidator.IsValidPhoneNumber(num);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void IsValidPhoneNumber_MuitoCurto_DeveRetornarFalso()
    {
        // Arrange
        string num = "12345";

        // Act
        bool result = PhoneNumberValidator.IsValidPhoneNumber(num);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public void GetCountryCode_NumeroBrasileiro_DeveRetornarBR()
    {
        // Arrange
        string numBR = "+5511987654321";

        // Act
        string pais = PhoneNumberValidator.GetCountryCodeFromPhoneNumber(numBR);

        // Assert
        Assert.Equal("BR", pais);
    }

    [Fact]
    public void GetCountryCode_NumeroAmericano_DeveRetornarUS()
    {
        // Arrange
        string numUS = "+12125551212";

        // Act
        string pais = PhoneNumberValidator.GetCountryCodeFromPhoneNumber(numUS);

        // Assert
        Assert.Equal("US", pais);
    }

    [Fact]
    public void GetCountryCode_SemSinalDeMais_DeveRetornarNull()
    {
        // Arrange
        string numInvalido = "11987654321";

        // Act
        string pais = PhoneNumberValidator.GetCountryCodeFromPhoneNumber(numInvalido);

        // Assert
        Assert.Null(pais);
    }
}
