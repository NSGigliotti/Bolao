
using Bolao.Models;

public class MachesService : IMachesService
{
    private readonly IMachesRepository _machesRepository;

    public MachesService(IMachesRepository machesRepository)
    {
        _machesRepository = machesRepository;
    }

    public async Task<List<MatchDto>> GetAllMatch()
    {
        var allMatch = await _machesRepository.GetAllMatch();

        Console.WriteLine(allMatch[0].Id);

        var groupedMatches = allMatch.GroupBy(m => m.Stage).OrderBy(g => g.Key).Select(g => new MatchDto
        {
            StageName = (char)g.Key,
            Matchs = g.OrderBy(m => m.MatchDate).ThenBy(m => m.Id).ToList()
        }).ToList();

        return groupedMatches;
    }

    public async Task<List<GroupDto>> GetGroupsAsync()
    {
        List<TeamModel> teams = await _machesRepository.GetGroupsAsync();

        var hosts = new List<string> { "Mexico", "Canada", "Estados Unidos" };

        var groupedTeams = teams.GroupBy(t => t.Group).OrderBy(g => g.Key).Select(g => new GroupDto
        {
            GroupName = g.Key,
            Teams = g.OrderByDescending(t => t.Points).ThenByDescending(t => t.Points == 0 && hosts.Contains(t.Name)).ThenByDescending(t => t.GoalDifference).ThenByDescending(t => t.GoalsFor).ThenByDescending(t => t.Wins).ThenBy(t => t.Name).ToList()
        }).ToList();

        return groupedTeams;
    }
}