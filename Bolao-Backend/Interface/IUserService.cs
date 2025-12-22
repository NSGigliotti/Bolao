using Bolao.DTOs;

public interface IUserService
{
    Task<string> RegisterUserAsync(CreateUserDTOs createUser);
    Task<string> LoginAsync(LoginDTOs login);
}