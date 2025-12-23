using Bolao.DTOs;
using Bolao.Interfaces;
using Bolao.Models;
using Bolao.Services;
using Microsoft.AspNetCore.Identity;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<string> RegisterUserAsync(CreateUserDTOs createUser)
    {
        if (string.IsNullOrWhiteSpace(createUser.Email)) throw new Exception("Email Necessário");
        if (await _userRepository.CheckEmailExist(createUser.Email)) throw new Exception("Email Já Utilizado");
        if (createUser.Password != createUser.ContirmPassword) throw new Exception("Senhas não correspondem");

        var passwordHasher = new PasswordHasher<object>();
        string passwordHash = passwordHasher.HashPassword(null, createUser.Password);
        string phoneClear = PhoneNumberValidator.ClearPhone(createUser.Phone);

        //if(!PhoneNumberValidator.IsValidPhoneNumber(createUser.Phone)) throw new Exception("Numero Invalido");

        string rawEmails = Environment.GetEnvironmentVariable("ADMIN_EMAILS") ?? string.Empty;
        bool isAdmin = rawEmails.Split(',').Select(e => e.Trim()).Contains(createUser.Email, StringComparer.OrdinalIgnoreCase);

        UserModel user = new UserModel(
            name: createUser.Name,
            email: createUser.Email,
            phone: phoneClear,
            password: passwordHash,
            isAdmin: isAdmin
        );

        UserModel newUser = await _userRepository.CreateUser(user);

        return _userRepository.CreatToken(newUser);
    }

    public async Task<string> LoginAsync(LoginDTOs login)
    {
        UserModel user = await _userRepository.GetUserFromEmail(login.Email);
        if (user == null) throw new Exception("E-mail ou senha inválidos");

        var passwordHasher = new PasswordHasher<object>();
        var result = passwordHasher.VerifyHashedPassword(user, user.Password, login.Password);

        if (result == PasswordVerificationResult.Failed) throw new Exception("E-mail ou senha inválidos");

        return _userRepository.CreatToken(user);
    }
}