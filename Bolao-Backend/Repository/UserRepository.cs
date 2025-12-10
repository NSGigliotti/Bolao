using System.Net.Mail;
using Bolao.Data;
using Bolao.Interfaces;
using Bolao.Models;
using Microsoft.EntityFrameworkCore;

namespace Bolao.Repository;

public class UserRepository : IUserRepository
{
    private readonly BolaoDbContext _BolaoDbContext ;

    UserRepository(BolaoDbContext bolaoDbContext)
    {
        _BolaoDbContext = bolaoDbContext;
    }
    public void ChangePassword(string password, Guid id)
    {
        throw new NotImplementedException();
    }

    public async Task<bool> CheckEmailExist(string email)
    {
        string normalizedEmail = email.Trim().ToLowerInvariant();
        bool exists = await _BolaoDbContext.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
        return exists;
    }

    public bool CheckEmailValid(string email)
    {
            try
        {

            var addr = new MailAddress(email);

            return addr.Address == email; 
        }
        catch (FormatException)
        {
            return false;
        }
    }

    public Task<UserModel> CreateUser(UserModel user)
    {
        throw new NotImplementedException();
    }

    public Task<string> CreatToken(UserModel user)
    {
        throw new NotImplementedException();
    }

    public Task<UserModel> DecriptToken(string token)
    {
        throw new NotImplementedException();
    }
}