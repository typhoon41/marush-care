using System.Net.Http.Json;
using System.Text.Json;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities;
using Microsoft.AspNetCore.Identity;

namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>A salon staff login, stored the way UserService.Create stores one: a PasswordHasher hash in Users.</summary>
public sealed class StaffAccount
{
    // Test-only credential, never used outside the in-memory database.
    private const string FakePassword = "fake-staff-password-for-tests";

    private StaffAccount(string username) => Username = username;

    public string Username { get; }

    public string Password { get; } = FakePassword;

    public object LoginBody => new { email = Username, password = Password };

    public static async Task<StaffAccount> Register(MarushApiFactory factory)
    {
        ArgumentNullException.ThrowIfNull(factory);
        var account = new StaffAccount($"staff-{Guid.NewGuid():N}");
        var hash = new PasswordHasher<ExistingUser>().HashPassword(new ExistingUser(Guid.Empty, account.Username, string.Empty), FakePassword);
        await factory.ChangeDatabase(async context =>
            _ = await context.Set<UserDto>().AddAsync(new UserDto { Username = account.Username, Password = hash },
                TestContext.Current.CancellationToken));
        return account;
    }

    public static async Task<MarushApiClient> SignedInClient(MarushApiFactory factory, string language = "sr")
    {
        var account = await Register(factory);
        var client = factory.CreateApiClient(language);
        client.UseToken(await account.SignIn(client));
        return client;
    }

    public async Task<string> SignIn(MarushApiClient client)
    {
        ArgumentNullException.ThrowIfNull(client);
        using var response = await client.Post("api/user/login", LoginBody);
        _ = response.EnsureSuccessStatusCode();
        var body = await response.Content.ReadFromJsonAsync<JsonElement>(TestContext.Current.CancellationToken);
        return body.GetProperty("token").GetString() ?? throw new InvalidOperationException("Login returned no token.");
    }
}
