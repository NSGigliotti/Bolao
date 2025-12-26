
using Bolao.Data;
using Bolao.Models;
using Microsoft.EntityFrameworkCore;

public class MachesRepository : IMachesRepository
{
    private readonly BolaoDbContext _BolaoDbContext;

    public MachesRepository(BolaoDbContext bolaoDbContext)
    {
        _BolaoDbContext = bolaoDbContext;
    }

    public async Task<List<MatchModel>> GetAllMatch()
    {
        var allMatch = await _BolaoDbContext.Matches.Include(m => m.HomeTeam).Include(m => m.AwayTeam).ToListAsync(); ;
        return allMatch;
    }

    public async Task<List<TeamModel>> GetGroupsAsync()
    {
        var allTeams = await _BolaoDbContext.Teams.ToListAsync();
        return allTeams;
    }
}