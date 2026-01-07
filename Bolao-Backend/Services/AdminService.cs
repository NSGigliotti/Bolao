using Bolao.DTOs;
using Bolao.Interfaces;
using Bolao.Models;

public class AdminService : IAdminService
{

    private readonly IUserRepository _userRepository;
    private readonly IMachesRepository _iMaachesRepository;

    public AdminService(IUserRepository userRepository, IMachesRepository machesRepository)
    {
        _userRepository = userRepository;
        _iMaachesRepository = machesRepository;
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

        MatchModel match = await _iMaachesRepository.GetMatchAsync(resultUpdateDTOs.MachID);

        if (resultUpdateDTOs.HomeTeamScore != match.HomeTeamScore)
        {
            match.HomeTeamScore = resultUpdateDTOs.HomeTeamScore;
        }
        else if (resultUpdateDTOs.AwayTeamScore != match.AwayTeamScore)
        {
            match.AwayTeamScore = resultUpdateDTOs.AwayTeamScore;
        }

        List<PredictionModel> predictions = await _iMaachesRepository.GetAllPedicitonByMachsId(resultUpdateDTOs.MachID);
        List<UserModel> users = await _userRepository.GetAllUsers();

        throw new NotImplementedException();
    }
}