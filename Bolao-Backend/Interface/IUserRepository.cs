using Bolao.Models;

namespace Bolao.Interfaces;
public interface IUserRepository
{
    Task<UserModel> CreateUser(UserModel user);
    Task<UserModel> GetUserFromEmail (string email);
    Task<UserModel> GetUserFromID (Guid id);
    bool CheckEmailValid(string email);
    Task<bool> CheckEmailExist(string email);
    string CreatToken(UserModel user);
    Task<UserModel> DecriptToken(string token);
    Task<UserModel> SaveStance(UserModel user);
    void ChangePassword(string password, Guid id);
    Task<UserModel> UpdateUser(UserModel user);
}