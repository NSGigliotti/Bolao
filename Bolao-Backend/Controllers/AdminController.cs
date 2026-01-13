using System.Security.Claims;
using Bolao.DTOs;
using Bolao.Interfaces;
using Bolao.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sprache;


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

    [Authorize(Roles = "Admin")]
    [HttpPost("ResultUpdate")]
    public async Task<IActionResult> ResultUpdate([FromBody] ResultUpdateDTOs resultUpdateDTOs)
    {
        try
        {
            string result = await _adminService.ResultUpdate(resultUpdateDTOs);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("AddTeamKnockoutStage")]
    public async Task<IActionResult> AddTeamKnockoutStage([FromBody] AddTeamKnockout addTeamKnockout)
    {
        try
        {
            string result = await _adminService.AddTeamKnockoutStage(addTeamKnockout);
            return Ok(result);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

}