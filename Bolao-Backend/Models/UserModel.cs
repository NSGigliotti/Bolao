namespace Bolao.Models;

public class UserModel
{
    public Guid Id {get; init;}
    public string Name {get; set;}
    public string Email {get; set;}
    public string Password {get; set;}
    public string Phone {get; set;}
    public int Score {get; set;}

    public UserModel()
    {
    }

    public UserModel(string name, string email, string password,  string phone)
    {
       Id = Guid.NewGuid();
       Name = name;
       Email = email;
       Password = password;
       Phone = phone;
       Score = 0; 
    }
}