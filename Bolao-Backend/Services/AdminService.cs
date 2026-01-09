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

        if (resultUpdateDTOs.HomeTeamScore != match.HomeTeamScore)
        {
            match.HomeTeamScore = resultUpdateDTOs.HomeTeamScore;
        }
        else if (resultUpdateDTOs.AwayTeamScore != match.AwayTeamScore)
        {
            match.AwayTeamScore = resultUpdateDTOs.AwayTeamScore;
        }

        // List<PredictionModel> predictions = await _iMaachesRepository.GetAllPedicitonByMachsId(resultUpdateDTOs.MachID);
        List<UserModel> users = await _userRepository.GetAllUsers();

        // throw new NotImplementedException();

        match.HomeTeamScore = resultUpdateDTOs.HomeTeamScore;
        match.AwayTeamScore = resultUpdateDTOs.AwayTeamScore;

        // Opcional: Atualizar status ou vencedor se necessário
        // match.Status = ... 

        //await _iMachesRepository.UpdateMatchAsync(match);

        // 2. Buscar todas as predições para este jogo
        List<PredictionModel> predictions = await _iMachesRepository.GetAllPedicitonByMachsId(match.Id);

        Console.WriteLine("vai entrar dentro do for");
        foreach (var prediction in predictions)
        {
            Console.WriteLine("passou dentro do for");
            // Buscamos o usuário dono da aposta
            var user = await _userRepository.GetUserFromID(prediction.UserId);
            if (user == null) continue;

            // Subtraímos a pontuação antiga que esta aposta tinha gerado para o usuário
            user.Score -= prediction.PointsGained;

            // 3. Lógica de cálculo da nova pontuação
            int newPoints = 0;

            // Determinar vencedores (ou empate)
            bool realHomeWinner = match.HomeTeamScore > match.AwayTeamScore;
            bool realAwayWinner = match.AwayTeamScore > match.HomeTeamScore;
            bool realDraw = match.HomeTeamScore == match.AwayTeamScore;

            bool predHomeWinner = prediction.HomeTeamScore > prediction.AwayTeamScore;
            bool predAwayWinner = prediction.AwayTeamScore > prediction.HomeTeamScore;
            bool predDraw = prediction.HomeTeamScore == prediction.AwayTeamScore;

            // ACERTO EM CHEIO (Placar exato): 3 Pontos
            if (prediction.HomeTeamScore == match.HomeTeamScore && prediction.AwayTeamScore == match.AwayTeamScore)
            {
                newPoints = 3;
            }
            // ACERTO DE TENDÊNCIA (Acertou quem venceu ou o empate, mas errou o placar): 1 Ponto
            else if ((realHomeWinner && predHomeWinner) || (realAwayWinner && predAwayWinner) || (realDraw && predDraw))
            {
                newPoints = 1;
            }

            // 4. Atualizar os dados
            prediction.PointsGained = newPoints;
            user.Score += newPoints;
            Console.WriteLine("User Score: " + user.Score);

            // Salvar as alterações
            await _iMachesRepository.UpdatePredictionAsync(prediction);
            await _userRepository.UpdateUser(user);
        }
        return ("ok");
    }
}