using Bolao.Models;

public interface IMachesRepository
{
   Task<List<TeamModel>> GetGroupsAsync();
   Task<List<MatchModel>> GetAllMatch();
}