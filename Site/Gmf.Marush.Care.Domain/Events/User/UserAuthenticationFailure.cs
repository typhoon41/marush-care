using Gmf.Net.Core.Common.Persistence.Handlers;

namespace Gmf.Marush.Care.Domain.Events.User;

public class UserAuthenticationFailure(Models.User user) : BaseUserEvent(user), IAuditUser
{
    public override string Name => "UserUnauthorized";

    public string Report() => "Failed authentication attempt was caught for user {Username} from IP {IpAddress} using {Browser} browser and coming from {Referrer}";
    public string[] Details() => [User.Username, UserDetails.IpAddress, UserDetails.Browser, UserDetails.Referrer];
}
