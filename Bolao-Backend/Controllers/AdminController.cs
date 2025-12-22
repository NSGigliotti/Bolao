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

    private readonly IAdminService _adminService;

    public AdminController(IAdminService adminService)
    {
        _adminService = adminService;
    }


    [Authorize(Roles = "Admin")]
    [HttpPost("PaymentUpdate")]
    public async Task<IActionResult> PlaymentUpdate([FromBody] PaymentUpdateDTOs payment)
    {
        try
        {
            string status = await _adminService.PlaymentUpdate(payment);
            return Ok(status);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}