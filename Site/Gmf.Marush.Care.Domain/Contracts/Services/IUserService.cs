using System.Security.Claims;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Services;
public interface IUserService
{
    Task<(bool Failure, Guid UserId)> ValidateAsync(User given);
    Task<bool> CreateAsync(User user);
    string GenerateJwtToken(string username, Guid userId);
    Guid GetUserIdFrom(ClaimsIdentity identity);
}
