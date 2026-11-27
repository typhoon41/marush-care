using Gmf.Marush.Care.Infrastructure.Data.Entities;
using Microsoft.AspNetCore.Identity;

namespace Gmf.Marush.Care.Infrastructure.Data.Seeding;

/// <summary>The administrator a fresh development database can be logged into with.</summary>
public static class DevelopmentUser
{
    public const string Username = "admin@marushcare.local";
    public const string Password = "Marush!2026";

    public static UserDto Administrator() => new()
    {
        Id = Guid.NewGuid(),
        Username = Username,
        Password = new PasswordHasher<UserDto>().HashPassword(new UserDto(), Password)
    };
}
