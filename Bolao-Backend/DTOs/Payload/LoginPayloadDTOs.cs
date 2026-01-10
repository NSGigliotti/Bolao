namespace Bolao.DTOs;

public class LoginPayloadDTOs
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Token {get; set;}

    public LoginPayloadDTOs(string name,string email, string token)
    {
        Name = name;
        Email = email;
        Token = token;
    }
}