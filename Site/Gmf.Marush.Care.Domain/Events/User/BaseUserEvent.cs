using Gmf.DDD.Common.Contracts;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Events.User;

public abstract class BaseUserEvent(Models.User user) : IDomainEvent
{
    public abstract string Name { get; }
    public dynamic Data => null!;

    protected Models.User User { get; } = user;
    protected UserRequestDetails UserDetails => User.RequestDetails;
}
