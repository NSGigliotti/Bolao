namespace Bolao.Interfaces;

using Bolao.DTOs;
using Bolao.Models;

public interface IMachesService
{
    Task<List<GroupDto>> GetGroupsAsync();
    Task<List<MatchDto>> GetAllMatch();
    Task<LoginPayloadDTOs> CreatePrediction(List<MakePredictionDTOs> makePredictionDTOs, Guid id);
    Task<List<UserRankPayloadDTOs>> GetAllRankUser();
    Task<List<PredictionModel>> GetMachesByUserId(Guid id);
}