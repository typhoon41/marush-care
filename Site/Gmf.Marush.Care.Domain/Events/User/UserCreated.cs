using Gmf.Net.Core.Common.Persistence.Handlers;

namespace Gmf.Marush.Care.Domain.Events.User;

public class UserCreated(Models.User user) : BaseUserEvent(user), IAuditUser
{
    public override string Name => "UserCreated";

    public string Report() => "User {Username} was created with id = [{Id}] from IP {IpAddress} using {Browser} browser and coming from {Referrer}";
    public string[] Details() => [User.Username, User.Id.ToString(), UserDetails.IpAddress, UserDetails.Browser, UserDetails.Referrer];
}
