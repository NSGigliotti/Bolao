using Bolao.DTOs;
using Bolao.Interfaces;
using Microsoft.AspNetCore.Mvc;

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

        if(await _userRepository.CheckEmailExist(createUser.Email)) return BadRequest("Email Necessario");   

        return Ok("");
    }
}