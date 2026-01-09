
using Bolao.Data;
using Bolao.Models;
using Microsoft.EntityFrameworkCore;

public class MachesRepository : IMachesRepository
{
    private readonly BolaoDbContext _bolaoDbContext;

    public MachesRepository(BolaoDbContext bolaoDbContext)
    {
        _bolaoDbContext = bolaoDbContext;
    }

    public async Task<string> CreatePrediction(List<PredictionModel> predictions)
    {
        _bolaoDbContext.Prediction.AddRangeAsync(predictions);
        await _bolaoDbContext.SaveChangesAsync();
        return "ok";
    }

    public async Task<List<MatchModel>> GetAllMatch()
    {
        var allMatch = await _bolaoDbContext.Matches.Include(m => m.HomeTeam).Include(m => m.AwayTeam).ToListAsync(); ;
        return allMatch;
    }

    public async Task<List<PredictionModel>> GetAllPedicitonById(Guid id)
    {
        var predictions = await _bolaoDbContext.Prediction.AsNoTracking().Where(x => x.UserId == id).ToListAsync();
        return predictions;
    }

    public async Task<List<PredictionModel>> GetAllPedicitonByMachsId(int id)
    {
        var Machs = await _bolaoDbContext.Prediction.AsNoTracking().Where(x => x.MatchId == id).ToListAsync();
        return Machs;
    }

    public async Task<List<TeamModel>> GetGroupsAsync()
    {
        var allTeams = await _bolaoDbContext.Teams.ToListAsync();
        return allTeams;
    }

    public async Task<MatchModel> GetMatchAsync(int id)
    {
        var match = await _bolaoDbContext.Matches.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return match;
    }

    public async Task<bool> UserHasPredictions(Guid userId)
    {
        return await _bolaoDbContext.Prediction.AnyAsync(p => p.UserId == userId);
    }
    public async Task UpdateMatchAsync(MatchModel match)
    {
        _bolaoDbContext.Matches.Update(match);
        await _bolaoDbContext.SaveChangesAsync();
    }

    public async Task UpdatePredictionAsync(PredictionModel prediction)
    {
        _bolaoDbContext.Prediction.Update(prediction);
        await _bolaoDbContext.SaveChangesAsync();
    }
}