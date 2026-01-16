namespace Bolao.DTOs;

public class LoginPayloadDTOs
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Token {get; set;}
    public bool GameMake {get; set;}
    public PaymentStatus Payment {get; set;}

    public LoginPayloadDTOs(string name,string email, string token, bool gameMake, PaymentStatus payment)
    {
        Name = name;
        Email = email;
        Token = token;
        GameMake = gameMake;
        Payment = payment;
    }
}