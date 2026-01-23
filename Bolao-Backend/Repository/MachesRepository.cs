
using Bolao.Data;
using Bolao.DTOs;
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
        var predictions = await _bolaoDbContext.Prediction
            .AsNoTracking()
            .Include(x => x.Match)
                .ThenInclude(m => m.HomeTeam)
            .Include(x => x.Match)
                .ThenInclude(m => m.AwayTeam)
            .Include(x => x.HomeTeam)
            .Include(x => x.AwayTeam)
            .Where(x => x.UserId == id)
            .ToListAsync();
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

    public async Task UpdatePredictionsRangeAsync(List<PredictionModel> predictions)
    {
        foreach (var prediction in predictions)
        {
            _bolaoDbContext.Prediction.Attach(prediction);
            _bolaoDbContext.Entry(prediction).Property(x => x.PointsGained).IsModified = true;
        }
        await _bolaoDbContext.SaveChangesAsync();
    }

    public async Task<List<UserModel>> GetAllRankUsers()
    {
        List<UserModel> users = await _bolaoDbContext.Users.Where(u => u.GameMake == true).ToListAsync();
        return users;
    }

    public async Task<TeamModel> GetTeamById(int? id)
    {
        TeamModel team = await _bolaoDbContext.Teams.FirstOrDefaultAsync(x => x.Id == id);
        return team;
    }

    public async Task UpdateTeam(TeamModel team)
    {
        _bolaoDbContext.Teams.Update(team);
        await _bolaoDbContext.SaveChangesAsync();
    }
}