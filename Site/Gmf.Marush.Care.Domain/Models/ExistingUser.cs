using Gmf.DDD.Common.Concepts;

namespace Gmf.Marush.Care.Domain.Models;

public class ExistingUser(Guid id, string username, string password) : Entity<Guid>(id)
{
    public string Username { get; } = username;
    public string Password { get; } = password;
}
