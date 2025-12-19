using System.Security.Claims;
using Bolao.DTOs;
using Bolao.Interfaces;
using Bolao.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("Admin")]
public class AdminController : ControllerBase
{

    private readonly IUserRepository _userRepository;

    public AdminController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }


    [Authorize(Roles = "Admin")]
    [HttpPost("PaymentUpdate")]
    public async Task<IActionResult> PlaymentUpdate([FromBody] PaymentUpdateDTOs payment)
    {

        if(payment.Id.ToString() == "" || payment.Id == null) return BadRequest("Id necessário");

        if(payment.CodeENUMPayment == null) return BadRequest("codigo invalido");

        UserModel user = await _userRepository.GetUserFromID(payment.Id);

        if (user == null) return NotFound("Usuário não encontrado");

        if(payment.CodeENUMPayment == PaymentStatus.Paid)
        {
            user.Status = PaymentStatus.Paid;
        } else if(payment.CodeENUMPayment == PaymentStatus.Cancelled)
        {
            user.Status = PaymentStatus.Cancelled;
        } else return BadRequest("Não foi possível processar a atualização: o status do pagamento fornecido é inválido ou não permitido para esta operação.");

        await _userRepository.SaveStance(user);

        return Ok(user);
    }
}