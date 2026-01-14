using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using Bolao.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Bolao.Interfaces;

[ApiController]
[Route("Maches")]
public class MachesController : ControllerBase
{
    private readonly IMachesService _machesService;

    public MachesController(IMachesService machesService)
    {
        _machesService = machesService;
    }

    [HttpGet("GetAllMaches")]
    public async Task<IActionResult> GetAllMaches()
    {
        var allMatch = await _machesService.GetAllMatch();
        return Ok(allMatch);
    }

    [HttpGet("GetMachesGups")]
    public async Task<IActionResult> GetMachesGups()
    {
        var allTimes = await _machesService.GetGroupsAsync();
        return Ok(allTimes);
    }

    [Authorize]
    [HttpPost("CreatePrediction")]
    public async Task<IActionResult> CreatePrediction([FromBody] List<MakePredictionDTOs> makePredictionDTOs)
    {

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        Console.WriteLine(userId);

        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out Guid id)) return Unauthorized("Usuário não identificado ou formato de ID inválido.");

        //Guid id = Guid.Parse(userId);

        try
        {
            await _machesService.CreatePrediction(makePredictionDTOs, id);

            return Ok(new { Id = userId });
        }
        catch (Exception ex)
        {

            return BadRequest(ex.Message);
        }
    }

    [HttpGet("GetAllRankUser")]
    public async Task<IActionResult> GetAllRankUser()
    {
        try
        {
            List<UserRankPayloadDTOs> userRanks = await _machesService.GetAllRankUser();
            return Ok(userRanks);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}

