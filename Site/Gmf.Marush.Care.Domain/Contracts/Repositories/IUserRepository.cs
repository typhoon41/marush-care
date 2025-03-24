using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Repositories;
public interface IUserRepository
{
    Task Create(User user);
    Task<ExistingUser?> FindUserBy(string username);
    Task AuditAuthenticationOf(ExistingUser user, UserRequestDetails userDetails);
}
