using Bolao.DTOs;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("User")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("CreatUser")]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDTOs createUser)
    {
        try 
        {
            var token = await _userService.RegisterUserAsync(createUser);
            return Ok(token);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] LoginDTOs login)
    {
        try
        {
            var token = await _userService.LoginAsync(login);
            return Ok(token);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}