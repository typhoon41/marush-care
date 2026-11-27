using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using Gmf.Marush.Care.Api.Tests.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Gmf.Marush.Care.Api.Tests.Security;

/// <summary>JWT bearer validation on the staff endpoints (AuthenticationExtensions, [Authorize] on CalendarController and CustomerController).</summary>
public sealed class TokenValidationTests(MarushApiFactory factory) : IClassFixture<MarushApiFactory>
{
    private const string WeekRoute = "api/calendar/week?weekStart=2031-07-07";

    public static TheoryData<string, string> StaffEndpoints => new()
    {
        { "GET", WeekRoute },
        { "GET", $"api/customer/{Guid.Empty}" },
        { "POST", "api/customer/get-all" },
        { "POST", "api/calendar/entry" },
        { "DELETE", $"api/calendar/entry/{Guid.Empty}" }
    };

    [Theory]
    [MemberData(nameof(StaffEndpoints))]
    public async Task Rule038_NoToken_Returns401(string method, string route)
    {
        using var anonymous = factory.CreateApiClient();

        using var response = method switch
        {
            "POST" => await anonymous.Post(route, new { }),
            "DELETE" => await anonymous.Delete(route),
            _ => await anonymous.Get(route)
        };

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Rule038_ATokenSignedWithTheConfiguredKeyIssuerAndAudience_IsAccepted() =>
        Assert.Equal(HttpStatusCode.OK, await WeekWith(Token(Jwt("Key"), Jwt("Issuer"), Jwt("Audience"), DateTime.UtcNow.AddMinutes(5))));

    [Fact]
    public async Task Rule038_AnotherSigningKey_Returns401() =>
        Assert.Equal(HttpStatusCode.Unauthorized,
            await WeekWith(Token("another-fake-signing-key-0000000000000000000000000000000000000", Jwt("Issuer"), Jwt("Audience"), DateTime.UtcNow.AddMinutes(5))));

    [Fact]
    public async Task Rule038_AnotherIssuer_Returns401() =>
        Assert.Equal(HttpStatusCode.Unauthorized,
            await WeekWith(Token(Jwt("Key"), "https://other-issuer.marush.test", Jwt("Audience"), DateTime.UtcNow.AddMinutes(5))));

    [Fact]
    public async Task Rule038_AnotherAudience_Returns401() =>
        Assert.Equal(HttpStatusCode.Unauthorized,
            await WeekWith(Token(Jwt("Key"), Jwt("Issuer"), "https://other-audience.marush.test", DateTime.UtcNow.AddMinutes(5))));

    // The default clock skew is 5 minutes, so the token expired 10 minutes ago.
    [Fact]
    public async Task Rule038_AnExpiredToken_Returns401() =>
        Assert.Equal(HttpStatusCode.Unauthorized, await WeekWith(Token(Jwt("Key"), Jwt("Issuer"), Jwt("Audience"), DateTime.UtcNow.AddMinutes(-10))));

    private static string Token(string key, string issuer, string audience, DateTime expires)
    {
        var credentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)), SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(issuer, audience, [new Claim(ClaimTypes.Name, "crafted"), new Claim(JwtRegisteredClaimNames.Sub, Guid.NewGuid().ToString())],
            expires.AddMinutes(-60), expires, credentials);
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private string Jwt(string setting) =>
        factory.Services.GetRequiredService<IConfiguration>()[$"Jwt:{setting}"] ?? throw new InvalidOperationException($"Jwt:{setting} is not configured.");

    private async Task<HttpStatusCode> WeekWith(string token)
    {
        using var client = factory.CreateApiClient();
        client.UseToken(token);
        using var response = await client.Get(WeekRoute);
        return response.StatusCode;
    }
}
