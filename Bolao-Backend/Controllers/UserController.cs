using Bolao.DTOs;
using Bolao.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Bolao.Models;
using Bolao.Services;
[ApiController]
[Route("User")]
public class UserController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public UserController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    [HttpPost()]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDTOs createUser)
    {
        if(createUser == null) return BadRequest("Dados de criação de usuário inválidos ou ausentes");

        if(createUser.Name == "" || createUser.Name == null) return BadRequest("Nome Necessario");
        
        if(createUser.Email == "" || createUser.Email == null) return BadRequest("Email Necessario");

        if(!_userRepository.CheckEmailValid(createUser.Email)) return BadRequest("Email Invalido"); 

        if(await _userRepository.CheckEmailExist(createUser.Email)) return BadRequest("Email Ja Utilizado");   

        if(createUser.Phone == "" || createUser.Phone == null) return BadRequest("Telefone Necessario");   

        if(!PhoneNumberValidator.IsValidPhoneNumber(createUser.Phone)) return BadRequest("Numero Invalido");

        if(createUser.Password == "" || createUser.Password == null) return BadRequest("Senha Necessaria");

        if(createUser.Password == "" || createUser.Password == null) return BadRequest("Confirmação de Senha Necessaria");

        if(createUser.Password != createUser.ContirmPassword) return BadRequest("Senha nao Correspondem");

        var passwordHasher = new PasswordHasher<object>();

        string passwordHash = passwordHasher.HashPassword(null, createUser.Password);

        string phoneClear = PhoneNumberValidator.ClearPhone(createUser.Phone);

        UserModel user = new UserModel(
            name: createUser.Name,
            email: createUser.Email,
            phone:phoneClear,
            password: passwordHash
        );

        UserModel newUser = await _userRepository.CreateUser(user);

        string token = _userRepository.CreatToken(newUser);


        return Ok(token);
    }
}