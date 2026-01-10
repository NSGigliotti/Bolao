using Bolao.Models;

public interface IMachesRepository
{
   Task<List<TeamModel>> GetGroupsAsync();
   Task<List<MatchModel>> GetAllMatch();
   Task<MatchModel> GetMatchAsync(int id);
   Task UpdatePredictionsRangeAsync (List<PredictionModel> predictions);
   Task<string> CreatePrediction(List<PredictionModel> predictions);
   Task<List<PredictionModel>> GetAllPedicitonById (Guid id);
   Task<bool> UserHasPredictions(Guid userId);
   Task<List<PredictionModel>> GetAllPedicitonByMachsId (int id);
   Task UpdateMatchAsync(MatchModel match);
   Task UpdatePredictionAsync(PredictionModel prediction);
}