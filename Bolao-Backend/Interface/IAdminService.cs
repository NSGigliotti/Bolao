using Bolao.DTOs;
using Bolao.Models;

public interface IAdminService
{
    Task<string> PlaymentUpdate(PaymentUpdateDTOs payment);
}