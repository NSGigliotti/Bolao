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

    [HttpGet("GetAllMachesGups")]
    public async Task<IActionResult> GetAllMachesGups()
    {
        var allTimes = await _machesService.GetGroupsAsync();
        return Ok(allTimes);
    }
    
}