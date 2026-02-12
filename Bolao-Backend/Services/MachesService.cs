
using Bolao.DTOs;
using Bolao.Enum;
using Bolao.Interfaces;
using Bolao.Models;
using Microsoft.AspNetCore.Http.HttpResults;

public class MachesService : IMachesService
{
    private readonly IMachesRepository _machesRepository;
    private readonly IUserRepository _userRepository;


    private string GetStageName(MatchStage stage) => stage switch
    {
        MatchStage.GroupStageRound1 => "1ª Rodada (Fase de Grupos)",
        MatchStage.GroupStageRound2 => "2ª Rodada (Fase de Grupos)",
        MatchStage.GroupStageRound3 => "3ª Rodada (Fase de Grupos)",
        MatchStage.RoundOf32 => "Segunda fase",
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
            Matchs = g.OrderBy(m => m.MatchDate).ToList()
        }).OrderBy(dto => dto.Matchs.FirstOrDefault()?.MatchDate).ToList();

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

    public async Task<LoginPayloadDTOs> CreatePrediction(List<MakePredictionDTOs> makePredictionDTOs, Guid id)
    {
        if (makePredictionDTOs == null) throw new Exception("Lista do bolao invalida");

        if (makePredictionDTOs.Count != 104) throw new Exception();

        if (await _machesRepository.UserHasPredictions(id)) throw new Exception("Usuario com o bolao ja criado");

        List<PredictionModel> userBolao = [];

        var allMatches = await _machesRepository.GetAllMatch();
        var matchesDict = allMatches.ToDictionary(m => m.Id);

        foreach (var i in makePredictionDTOs)
        {
            if (matchesDict.TryGetValue(i.MatchId, out var match))
            {
                if (match.Stage >= Bolao.Enum.MatchStage.RoundOf32 && i.HomeTeamScore == i.AwayTeamScore)
                {
                    throw new Exception($"Empates não são permitidos em fases de mata-mata ({match.Id})");
                }
            }

            PredictionModel prediction = new PredictionModel(
                 userId: id,
                 matchId: i.MatchId,
                 homeTeamScore: i.HomeTeamScore,
                 awayTeamScore: i.AwayTeamScore,
                 homeTeamId: i.IdHomeTeam,
                 awayTeamId: i.IdAwayTeam
            );
            userBolao.Add(prediction);
        }

        await _machesRepository.CreatePrediction(userBolao);
        UserModel user = await _userRepository.GetUserFromID(id);
        user.GameMake = true;
        await _userRepository.UpdateUser(user);

        var token = _userRepository.CreatToken(user);

        LoginPayloadDTOs loginPayload = new LoginPayloadDTOs(name: user.Name, email: user.Email, token: token, gameMake: user.GameMake, payment: user.Status);

        return loginPayload;
    }
    public async Task<string> ResultUpdate(ResultUpdateDTOs resultUpdateDTOs)
    {
        MatchModel match = await _machesRepository.GetMatchAsync(resultUpdateDTOs.MachID);
        if (match == null) return "Partida não encontrada";

        match.HomeTeamScore = resultUpdateDTOs.HomeTeamScore;
        match.AwayTeamScore = resultUpdateDTOs.AwayTeamScore;

        await _machesRepository.UpdateMatchAsync(match);

        List<PredictionModel> predictions = await _machesRepository.GetAllPedicitonByMachsId(resultUpdateDTOs.MachID);

        int officialResult = match.HomeTeamScore > match.AwayTeamScore ? 1 : match.HomeTeamScore < match.AwayTeamScore ? 2 : 0;

        foreach (var prediction in predictions)
        {
            int pointsEarned = 0;

            int predictionResult = prediction.HomeTeamScore > prediction.AwayTeamScore ? 1 : prediction.AwayTeamScore > prediction.HomeTeamScore ? 2 : 0;

            if (prediction.HomeTeamScore == match.HomeTeamScore &&
                prediction.AwayTeamScore == match.AwayTeamScore)
            {
                pointsEarned = 3;
            }
            else if (predictionResult == officialResult)
            {
                pointsEarned = 1;
            }

            prediction.PointsGained = pointsEarned;
            await _machesRepository.UpdatePredictionAsync(prediction);
        }

        return "Placares e pontuações atualizados com sucesso";
    }

    public async Task<List<UserRankPayloadDTOs>> GetAllRankUser()
    {
        List<UserModel> users = await _machesRepository.GetAllRankUsers();
        List<UserRankPayloadDTOs> userRanks = [];
        foreach (var i in users)
        {
            UserRankPayloadDTOs userRank = new UserRankPayloadDTOs(
                id: i.Id,
                name: i.Name,
                score: i.Score
            );
            userRanks.Add(userRank);
        }

        userRanks = userRanks.OrderByDescending(u => u.Score).ThenBy(u => u.Name).ToList();
        return userRanks;
    }

    public async Task<List<PredictionModel>> GetMachesByUserId(Guid id)
    {
        List<PredictionModel> predictions = await _machesRepository.GetAllPedicitonById(id);
        predictions.Sort((x, y) => x.MatchId.CompareTo(y.MatchId));
        return predictions;
    }
}