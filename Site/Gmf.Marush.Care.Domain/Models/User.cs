using Gmf.DDD.Common.Concepts;

namespace Gmf.Marush.Care.Domain.Models;

public class User(string username, string password, UserRequestDetails requestDetails) : Entity<Guid>(Guid.NewGuid())
{
    public string Username { get; } = username;
    public string Password { get; } = password;
    public UserRequestDetails RequestDetails { get; } = requestDetails;

    public User CloneWith(string hashedPassword) => new(Username, hashedPassword, RequestDetails);
}
