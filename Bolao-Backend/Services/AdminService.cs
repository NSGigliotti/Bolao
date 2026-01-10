using Bolao.DTOs;
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
        List<UserModel> users = new List<UserModel>();

        foreach (var prediction in predictions)
        {
            var user = await _userRepository.GetUserFromID(prediction.UserId);
            if (user == null) continue;

            user.Score -= prediction.PointsGained;

            int newPoints = 0;
            bool realHomeWinner = match.HomeTeamScore > match.AwayTeamScore;
            Console.WriteLine(realHomeWinner);
            bool realAwayWinner = match.AwayTeamScore > match.HomeTeamScore;
            Console.WriteLine(realAwayWinner);
            bool realDraw = match.HomeTeamScore == match.AwayTeamScore;
            Console.WriteLine(realDraw);

            bool predHomeWinner = prediction.HomeTeamScore > prediction.AwayTeamScore;
            Console.WriteLine(predHomeWinner);
            bool predAwayWinner = prediction.AwayTeamScore > prediction.HomeTeamScore;
            Console.WriteLine(predAwayWinner);
            bool predDraw = prediction.HomeTeamScore == prediction.AwayTeamScore;
            Console.WriteLine(predDraw);

            if (prediction.HomeTeamScore == match.HomeTeamScore && prediction.AwayTeamScore == match.AwayTeamScore)
            {
                newPoints = 3;
            }
            else if ((realHomeWinner && predHomeWinner) || (realAwayWinner && predAwayWinner) || (realDraw && predDraw))
            {
                newPoints = 1;
            }

            if (prediction.PointsGained != newPoints)
            {
                prediction.PointsGained = newPoints;
            }

            user.Score += newPoints;
        }

        await _iMachesRepository.UpdatePredictionsRangeAsync(predictions);
        await _userRepository.UpdateAllUsers(users);

        return "ok";
    }
}