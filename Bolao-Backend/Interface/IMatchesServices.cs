using Bolao.DTOs;
using Bolao.Models;

public interface IMachesService
{
   Task<List<GroupDto>> GetGroupsAsync();
   Task<List<MatchDto>> GetAllMatch();
}