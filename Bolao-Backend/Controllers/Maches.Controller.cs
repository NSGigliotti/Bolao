using Microsoft.AspNetCore.Mvc;

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
    
}