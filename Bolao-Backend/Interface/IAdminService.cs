using Bolao.DTOs;
using Bolao.Models;

public interface IAdminService
{
    Task<string> PlaymentUpdate(PaymentUpdateDTOs payment);
    Task<string> ResultUpdate (ResultUpdateDTOs resultUpdateDTOs);
    Task<string> AddTeamKnockoutStage(AddTeamKnockout addTeamKnockout);
}