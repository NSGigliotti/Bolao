namespace Bolao.Models;

public class UserModel
{
    public Guid Id {get; init;}
    public string Name {get; set;}
    public string Email {get; set;}
    public string Password {get; set;}
    public string Phone {get; set;}
    public int Score {get; set;} = 0;
    public bool IsAdmin {get; set;} 
    public bool GameMake {get; set;} = false;

    public PaymentStatus Status {get; set;} = PaymentStatus.Pending;

    public UserModel()
    {
    }

    public UserModel(string name, string email, string password,  string phone, bool isAdmin)
    {
       Id = Guid.NewGuid();
       Name = name;
       Email = email;
       Password = password;
       Phone = phone;
       Score = 0; 
       IsAdmin = isAdmin;
    }
}