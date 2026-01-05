
using Bolao.DTOs;
using Bolao.Enum;
using Bolao.Interfaces;
using Bolao.Models;

public class MachesService : IMachesService
{
    private readonly IMachesRepository _machesRepository;
    private readonly IUserRepository _userRepository;


    private string GetStageName(MatchStage stage) => stage switch
    {
        MatchStage.GroupStageRound1 => "1ª Rodada (Fase de Grupos)",
        MatchStage.GroupStageRound2 => "2ª Rodada (Fase de Grupos)",
        MatchStage.GroupStageRound3 => "3ª Rodada (Fase de Grupos)",
        MatchStage.RoundOf32 => "32-avos de Final",
        MatchStage.RoundOf16 => "Oitavas de Final",
        MatchStage.QuarterFinals => "Quartas de Final",
        MatchStage.SemiFinals => "Semifinais",
        MatchStage.ThirdPlace => "Terceiro Lugar",
        MatchStage.Final => "Final",
        _ => "Outros"
    };

    public MachesService(IMachesRepository machesRepository, IUserRepository userRepository)
    {
        _machesRepository = machesRepository;
        _userRepository = userRepository;
    }



    public async Task<List<MatchDto>> GetAllMatch()
    {
        var allMatch = await _machesRepository.GetAllMatch();


        var groupedMatches = allMatch.OrderBy(m => m.MatchDate).GroupBy(m => m.Stage).Select(g => new MatchDto
        {
            StageName = GetStageName(g.Key),
            Matchs = g.ToList()
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

    public async Task<string> CreatePrediction(List<MakePredictionDTOs> makePredictionDTOs, Guid id)
    {
        if (makePredictionDTOs == null) throw new Exception("Lista do bolao invalida");

        if (makePredictionDTOs.Count != 104) throw new Exception();

        if(await _machesRepository.UserHasPredictions(id)) throw new Exception("Usuario com o bolao ja criado");

        List<PredictionModel> userBolao = [];

        foreach (var i in makePredictionDTOs)
        {
            if (i.MatchId == null) throw new Exception("Id da partida invalido");

            if (i.HomeTeamScore == null || i.AwayTeamScore == null) throw new Exception("");

            PredictionModel prediction = new PredictionModel(
                 userId: id,
                 matchId: i.MatchId,
                 homeTeamScore: i.HomeTeamScore,
                 awayTeamScore: i.AwayTeamScore
            );
            userBolao.Add(prediction);
        }

        await _machesRepository.CreatePrediction(userBolao);
        UserModel user = await _userRepository.GetUserFromID(id);
        user.GameMake = true;
        await _userRepository.UpdateUser(user);


        throw new NotImplementedException();
    }
}