using Bolao.Models;

public interface IMachesRepository
{
   Task<List<TeamModel>> GetGroupsAsync();
   Task<List<MatchModel>> GetAllMatch();
   Task<string> CreatePrediction(List<PredictionModel> predictions);
   Task<List<PredictionModel>> GetAllPedicitonById (Guid id);
   Task<bool> UserHasPredictions(Guid userId);
}