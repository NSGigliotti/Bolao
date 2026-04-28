using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;
using Bolao.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Bolao.Interfaces;
using Bolao.Models;

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


        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out Guid id)) return Unauthorized("Usuário não identificado ou formato de ID inválido.");

        //Guid id = Guid.Parse(userId);

        try
        {
            var result = await _machesService.CreatePrediction(makePredictionDTOs, id);

            return Ok(result);
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

    [HttpPost("GetMachesByUserId")]
    public async Task<IActionResult> GetMachesByUserId([FromBody] Guid id)
    {
        try
        {
            List<PredictionModel> userPredicitons = await _machesService.GetMachesByUserId(id);
            return Ok(userPredicitons);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("CreateAPrediction")]
    public async Task<IActionResult> CreateAPrediction([FromBody] MakePredictionDTOs makePrediction)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out Guid id)) return Unauthorized("Usuário não identificado ou formato de ID inválido.");

        try
        {
           Guid idMach =  await _machesService.CreateAPrediction(makePrediction, id);
           return Ok(idMach);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("UpdatePreditions")]
    public async Task<IActionResult> UpdatePreditions([FromBody] UpdatePredicitionDTOS updatePredicition)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out Guid id)) return Unauthorized("Usuário não identificado ou formato de ID inválido.");

        try
        {
            await _machesService.UpdatePrediction(updatePredicition, id);
           return Ok();
        }
        catch (Exception ex)
        {
          return BadRequest(ex.Message);
        }
    }

    [HttpPost("FinishPredictions")]
    public async Task<IActionResult> FinishPredictions()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out Guid id)) return Unauthorized("Usuário não identificado ou formato de ID inválido.");

        try
        {
          await _machesService.FinishPrediction(id);
          return Ok();
        }
        catch (Exception ex)
        {
          return BadRequest(ex.Message);
        }
    }
}

