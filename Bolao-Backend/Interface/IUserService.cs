using Bolao.DTOs;

public interface IUserService
{
    Task<LoginPayloadDTOs> RegisterUserAsync(CreateUserDTOs createUser);
    Task<LoginPayloadDTOs> LoginAsync(LoginDTOs login);
}