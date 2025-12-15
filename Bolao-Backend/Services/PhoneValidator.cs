using PhoneNumbers;
using System;

namespace Bolao.Services;

public class PhoneNumberValidator
{
    public static bool IsValidPhoneNumber(string phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(phoneNumber))
        {
            return false;
        }

        var phoneUtil = PhoneNumberUtil.GetInstance();


        try
        {
            string? defaultRegionCode = GetCountryCodeFromPhoneNumber(phoneNumber);

            var number = phoneUtil.Parse(phoneNumber, defaultRegionCode?.ToUpper());

            bool isValid = phoneUtil.IsValidNumber(number);

            Console.WriteLine(phoneNumber + " : " + defaultRegionCode + " isValid: " + isValid );

            return isValid;
        }
        catch (NumberParseException e)
        {
            Console.WriteLine($"Erro ao analisar o número: {e.Message}");
            return false;
        }
    }

    public static string? GetCountryCodeFromPhoneNumber(string phoneNumber)
    {
        if (string.IsNullOrWhiteSpace(phoneNumber))
        {
            return null;
        }

        var phoneUtil = PhoneNumberUtil.GetInstance();

        try
        {
            var number = phoneUtil.Parse(phoneNumber, "ZZ");

            string regionCode = phoneUtil.GetRegionCodeForNumber(number);

            return regionCode;
        }
        catch (NumberParseException e)
        {
            return null;
        }
        catch (Exception ex)
        {
            return null;
        }
    }

    public static string ClearPhone(string texto)
    {
        if (string.IsNullOrEmpty(texto))
        {
            return texto;
        }
        
        return System.Text.RegularExpressions.Regex.Replace(texto, @"\D", "");
    }
}