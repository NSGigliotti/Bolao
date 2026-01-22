using Bolao.DTOs;
using Bolao.Enum;
using Bolao.Interfaces;
using Bolao.Models;
using Microsoft.AspNetCore.Http.HttpResults;

public class AdminService : IAdminService
{

    private readonly IUserRepository _userRepository;
    private readonly IMachesRepository _iMatchRepository;

    public AdminService(IUserRepository userRepository, IMachesRepository machesRepository)
    {
        _userRepository = userRepository;
        _iMatchRepository = machesRepository;
    }

    public async Task<string> PlaymentUpdate(PaymentUpdateDTOs payment)
    {
        if (string.IsNullOrWhiteSpace(payment.Id.ToString())) throw new Exception("Id necessário");
        if (payment.CodeENUMPayment == null) throw new Exception("codigo invalido");

        UserModel user = await _userRepository.GetUserFromID(payment.Id);

        if (user == null) throw new Exception("Usuário não encontrado");

        if (payment.CodeENUMPayment == PaymentStatus.Paid)
        {
            user.Status = PaymentStatus.Paid;
        }
        else if (payment.CodeENUMPayment == PaymentStatus.Cancelled)
        {
            user.Status = PaymentStatus.Cancelled;
        }
        else throw new Exception("Não foi possível processar a atualização: o status do pagamento fornecido é inválido ou não permitido para esta operação.");

        await _userRepository.UpdateUser(user);

        return "Status de pagamento atualizado";
    }

    public async Task<string> ResultUpdate(ResultUpdateDTOs resultUpdateDTOs)
    {
        MatchModel match = await _iMatchRepository.GetMatchAsync(resultUpdateDTOs.MachID);

        if (match == null) throw new Exception("Partida não encontrada");


        TeamModel team1 = await _iMatchRepository.GetTeamById(match.HomeTeamId);
        TeamModel team2 = await _iMatchRepository.GetTeamById(match.AwayTeamId);

        bool isGroupStage = match.Stage == MatchStage.GroupStageRound1 || match.Stage == MatchStage.GroupStageRound2 || match.Stage == MatchStage.GroupStageRound3;


        if (isGroupStage)
        {
            if (match.HomeTeamScore > resultUpdateDTOs.HomeTeamScore)
            {
                team1.GoalsFor = team1.GoalsFor - 1;
                team2.GoalsAgainst = team2.GoalsAgainst - 1;
            }
            else if (match.HomeTeamScore < resultUpdateDTOs.HomeTeamScore)
            {
                team1.GoalsFor = team1.GoalsFor + 1;
                team2.GoalsAgainst = team2.GoalsAgainst + 1;
            }

            if (match.AwayTeamScore > resultUpdateDTOs.AwayTeamScore)
            {
                team1.GoalsAgainst = team1.GoalsAgainst - 1;
                team2.GoalsFor = team2.GoalsFor - 1;
            }
            else if (match.AwayTeamScore < resultUpdateDTOs.AwayTeamScore)
            {
                team1.GoalsAgainst = team1.GoalsAgainst + 1;
                team2.GoalsFor = team2.GoalsFor + 1;
            }
        }


        List<PredictionModel> predictions = await _iMatchRepository.GetAllPedicitonByMachsId(match.Id);
        List<UserModel> users = await _userRepository.GetAllUsers();


        int oldPoints1 = 0;
        int oldPoints2 = 0;

        if (isGroupStage && match.Status == MatchStatus.Finished && match.HomeTeamScore.HasValue && match.AwayTeamScore.HasValue)
        {
            if (match.HomeTeamScore > match.AwayTeamScore) oldPoints1 = 3;
            else if (match.HomeTeamScore < match.AwayTeamScore) oldPoints2 = 3;
            else { oldPoints1 = 1; oldPoints2 = 1; }
        }

        int newPoints1 = 0;
        int newPoints2 = 0;
        int? newWinnerId = null;

        if (resultUpdateDTOs.HomeTeamScore > resultUpdateDTOs.AwayTeamScore)
        {
            newWinnerId = match.HomeTeamId;
            newPoints1 = 3;
        }
        else if (resultUpdateDTOs.HomeTeamScore < resultUpdateDTOs.AwayTeamScore)
        {
            newWinnerId = match.AwayTeamId;
            newPoints2 = 3;
        }
        else
        {
            newWinnerId = null; 
            newPoints1 = 1;
            newPoints2 = 1;
        }

        if (isGroupStage)
        {
            if (team1 != null) team1.Points = team1.Points - oldPoints1 + newPoints1;
            if (team2 != null) team2.Points = team2.Points - oldPoints2 + newPoints2;
        }

        match.HomeTeamScore = resultUpdateDTOs.HomeTeamScore;
        match.AwayTeamScore = resultUpdateDTOs.AwayTeamScore;
        match.WinnerId = newWinnerId;
        match.Status = MatchStatus.Finished; 

        foreach (var prediction in predictions)
        {
            var user = users.FirstOrDefault(u => u.Id == prediction.UserId);
            if (user == null) continue;

            user.Score -= prediction.PointsGained;
            int earnedPoints = 0;

            if (isGroupStage)
            {
                bool realHomeWinner = match.HomeTeamScore > match.AwayTeamScore;
                bool realAwayWinner = match.AwayTeamScore > match.HomeTeamScore;
                bool realDraw = match.HomeTeamScore == match.AwayTeamScore;

                bool predHomeWinner = prediction.HomeTeamScore > prediction.AwayTeamScore;
                bool predAwayWinner = prediction.AwayTeamScore > prediction.HomeTeamScore;
                bool predDraw = prediction.HomeTeamScore == prediction.AwayTeamScore;

                if (prediction.HomeTeamScore == match.HomeTeamScore && prediction.AwayTeamScore == match.AwayTeamScore)
                {
                    earnedPoints = 3;
                }
                else if ((realHomeWinner && predHomeWinner) || (realAwayWinner && predAwayWinner) || (realDraw && predDraw))
                {
                    earnedPoints = 1;
                }
            }
            else 
            {
                bool correctTeams = prediction.HomeTeamId == match.HomeTeamId && prediction.AwayTeamId == match.AwayTeamId;
                if (correctTeams)
                {
                    bool realHomeWinner = match.HomeTeamScore > match.AwayTeamScore;
                    bool realAwayWinner = match.AwayTeamScore > match.HomeTeamScore;
                    bool realDraw = match.HomeTeamScore == match.AwayTeamScore;

                    bool predHomeWinner = prediction.HomeTeamScore > prediction.AwayTeamScore;
                    bool predAwayWinner = prediction.AwayTeamScore > prediction.HomeTeamScore;
                    bool predDraw = prediction.HomeTeamScore == prediction.AwayTeamScore;

                    if (prediction.HomeTeamScore == match.HomeTeamScore && prediction.AwayTeamScore == match.AwayTeamScore)
                    {
                        earnedPoints = 3;
                    }
                    else if ((realHomeWinner && predHomeWinner) || (realAwayWinner && predAwayWinner) || (realDraw && predDraw))
                    {
                        earnedPoints = 1;
                    }
                }
            }

            prediction.PointsGained = earnedPoints;
            user.Score += earnedPoints;
        }

        if (isGroupStage)
        {
            for (int i = 0; i < predictions.Count; i++)
            {
                users[i].Score -= predictions[i].PointsGained;

                int newPoints = 0;

                bool realHomeWinner = match.HomeTeamScore > match.AwayTeamScore;
                bool realAwayWinner = match.AwayTeamScore > match.HomeTeamScore;
                bool realDraw = match.HomeTeamScore == match.AwayTeamScore;

                bool predHomeWinner = predictions[i].HomeTeamScore > predictions[i].AwayTeamScore;
                bool predAwayWinner = predictions[i].AwayTeamScore > predictions[i].HomeTeamScore;
                bool predDraw = predictions[i].HomeTeamScore == predictions[i].AwayTeamScore;

                if (predictions[i].HomeTeamScore == match.HomeTeamScore && predictions[i].AwayTeamScore == match.AwayTeamScore)
                {
                    newPoints = 3;
                }
                else if ((realHomeWinner && predHomeWinner) || (realAwayWinner && predAwayWinner) || (realDraw && predDraw))
                {
                    newPoints = 1;
                }

                if (predictions[i].PointsGained != newPoints)
                {
                    predictions[i].PointsGained = newPoints;
                }

                users[i].Score += newPoints;
            }

        }
        else
        {
            for (int i = 0; i < predictions.Count; i++)
            {
                var user = users.FirstOrDefault(u => u.Id == predictions[i].UserId);
                if (user == null) continue;

                user.Score -= predictions[i].PointsGained;

                int newPoints = 0;

                bool correctTeams = predictions[i].HomeTeamId == match.HomeTeamId && predictions[i].AwayTeamId == match.AwayTeamId;

                if (correctTeams)
                {
                    bool realHomeWinner = match.HomeTeamScore > match.AwayTeamScore;
                    bool realAwayWinner = match.AwayTeamScore > match.HomeTeamScore;
                    bool realDraw = match.HomeTeamScore == match.AwayTeamScore;

                    bool predHomeWinner = predictions[i].HomeTeamScore > predictions[i].AwayTeamScore;
                    bool predAwayWinner = predictions[i].AwayTeamScore > predictions[i].HomeTeamScore;
                    bool predDraw = predictions[i].HomeTeamScore == predictions[i].AwayTeamScore;

                    if (predictions[i].HomeTeamScore == match.HomeTeamScore && predictions[i].AwayTeamScore == match.AwayTeamScore)
                    {
                        newPoints = 3;
                    }
                    else if ((realHomeWinner && predHomeWinner) || (realAwayWinner && predAwayWinner) || (realDraw && predDraw))
                    {
                        newPoints = 1;
                    }
                }

                predictions[i].PointsGained = newPoints;
                user.Score += newPoints;
            }
        }

        await _iMatchRepository.UpdateTeam(team1);
        await _iMatchRepository.UpdateTeam(team2);
        await _iMatchRepository.UpdateMatchAsync(match);
        await _iMatchRepository.UpdatePredictionsRangeAsync(predictions);
        await _userRepository.UpdateAllUsers(users);

        return "ok";
    }

    public async Task<string> AddTeamKnockoutStage(AddTeamKnockout addTeamKnockout)
    {
        var match = await _iMatchRepository.GetMatchAsync(addTeamKnockout.IdMacht);

        bool isGroupStage = match.Stage == MatchStage.GroupStageRound1 || match.Stage == MatchStage.GroupStageRound2 || match.Stage == MatchStage.GroupStageRound3;

        if (!isGroupStage)
        {
            match.HomeTeamId = addTeamKnockout.IdHomeTeam;
            match.AwayTeamId = addTeamKnockout.IdAwayTeam;

            match.AwayTeamScore = 0;
            match.HomeTeamScore = 0;

            await _iMatchRepository.UpdateMatchAsync(match);

        }
        else throw new Exception("Jogo fora da fase mata-mata");



        return "Jogo adicionado com sucesso";

    }
}