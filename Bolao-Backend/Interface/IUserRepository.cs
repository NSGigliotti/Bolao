using Bolao.Models;

namespace Bolao.Interfaces;
public interface IUserRepository
{
    Task<UserModel> CreateUser(UserModel user);
    bool CheckEmailValid(string email);
    Task<bool> CheckEmailExist(string email);
    string CreatToken(UserModel user);
    Task<UserModel> DecriptToken(string token);
    void ChangePassword(string password, Guid id);
}