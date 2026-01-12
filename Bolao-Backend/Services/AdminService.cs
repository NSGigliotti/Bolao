using Bolao.DTOs;
using Bolao.Enum;
using Bolao.Interfaces;
using Bolao.Models;

public class AdminService : IAdminService
{

    private readonly IUserRepository _userRepository;
    private readonly IMachesRepository _iMachesRepository;

    public AdminService(IUserRepository userRepository, IMachesRepository machesRepository)
    {
        _userRepository = userRepository;
        _iMachesRepository = machesRepository;
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
        MatchModel match = await _iMachesRepository.GetMatchAsync(resultUpdateDTOs.MachID);

        if (match == null) throw new Exception("Partida não encontrada");

        match.HomeTeamScore = resultUpdateDTOs.HomeTeamScore;
        match.AwayTeamScore = resultUpdateDTOs.AwayTeamScore;
        await _iMachesRepository.UpdateMatchAsync(match);

        List<PredictionModel> predictions = await _iMachesRepository.GetAllPedicitonByMachsId(match.Id);
        List<UserModel> users = await _userRepository.GetAllUsers();

        bool isGroupStage = match.Stage == MatchStage.GroupStageRound1 || match.Stage == MatchStage.GroupStageRound2 || match.Stage == MatchStage.GroupStageRound3;

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


        await _iMachesRepository.UpdatePredictionsRangeAsync(predictions);
        await _userRepository.UpdateAllUsers(users);

        return "ok";
    }
}