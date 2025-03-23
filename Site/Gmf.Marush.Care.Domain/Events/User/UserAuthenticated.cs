using Gmf.Marush.Care.Domain.Models;
using Gmf.Net.Core.Common.Persistence.Handlers;

namespace Gmf.Marush.Care.Domain.Events.User;

public class UserAuthenticated(ExistingUser existingUser, UserRequestDetails userDetails)
    : BaseUserEvent(new Models.User(existingUser.Username, existingUser.Password, userDetails)), IAuditUser
{
    public override string Name => "UserAuthenticated";

    public string Report() => "User {Username} (id = {Id}) was authenticated from IP {IpAddress} using {Browser} browser and coming from {Referrer}";
    public string[] Details() => [User.Username, existingUser.Id.ToString(), UserDetails.IpAddress, UserDetails.Browser, UserDetails.Referrer];
}
