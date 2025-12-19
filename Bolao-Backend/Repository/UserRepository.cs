using System.Net.Mail;
using Bolao.Data;
using Bolao.Interfaces;
using Bolao.Models;
using Microsoft.EntityFrameworkCore;

namespace Bolao.Repository;

public class UserRepository : IUserRepository
{
    private readonly BolaoDbContext _BolaoDbContext ;
    private readonly JwtService _jwtService;

    public UserRepository(BolaoDbContext bolaoDbContext, JwtService jwtService)
    {
        _BolaoDbContext = bolaoDbContext;
        _jwtService = jwtService;
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

    public async Task<UserModel> CreateUser(UserModel user)
    {
        _BolaoDbContext.Users.Add(user);
        await _BolaoDbContext.SaveChangesAsync();
        return user;
    }

    public string CreatToken(UserModel user)
    {
        string token = _jwtService.GenerateToken(user);
        return token ;
    }

    public Task<UserModel> DecriptToken(string token)
    {
        throw new NotImplementedException();
    }

    public async Task<UserModel> GetUserFromEmail(string email)
    {
        UserModel user = await _BolaoDbContext.Users.FirstOrDefaultAsync(u => u.Email == email);
        return user;
    }

    public async Task<UserModel> GetUserFromID(Guid id)
    {
        UserModel user = await _BolaoDbContext.Users.FirstOrDefaultAsync(u => u.Id == id);
        return user;
    }

    public async Task<UserModel> SaveStance(UserModel user)
    {
        var userExistente = await _BolaoDbContext.Users.FindAsync(user.Id);
        _BolaoDbContext.Entry(userExistente).CurrentValues.SetValues(user);
        await _BolaoDbContext.SaveChangesAsync();
        return userExistente;
    }
}