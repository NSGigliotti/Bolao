using Bolao.Models;

namespace Bolao.Interfaces;
public interface IUserRepository
{
    Task<UserModel> CreateUser(UserModel user);
    Task<UserModel> GetUserFromEmail (string email);
    Task<UserModel> GetUserFromID (Guid id);
    Task<List<UserModel>> GetAllUsers();
    Task<List<UserModel>> UpdateAllUsers(List<UserModel> users);
    bool CheckEmailValid(string email);
    Task<bool> CheckEmailExist(string email);
    string CreatToken(UserModel user);
    Task<UserModel> DecriptToken(string token);
    void ChangePassword(string password, Guid id);
    Task<UserModel> UpdateUser(UserModel user);
}