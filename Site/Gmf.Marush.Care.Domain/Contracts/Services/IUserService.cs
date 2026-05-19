using System.Security.Claims;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Services;
public interface IUserService
{
    Task<(bool Failure, Guid UserId)> Validate(User given);
    Task<bool> Create(User user);
    string GenerateJwtToken(string username, Guid userId);
    Guid GetUserIdFrom(ClaimsIdentity identity);
}
