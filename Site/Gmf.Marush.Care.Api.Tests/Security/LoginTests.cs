using System.IdentityModel.Tokens.Jwt;
using System.Net;
using Gmf.Marush.Care.Api.Tests.Hosting;
using Gmf.Marush.Care.Domain.Events.User;

namespace Gmf.Marush.Care.Api.Tests.Security;

/// <summary>POST api/user/login (UserController.Login, UserService.Validate) and the DEBUG-only api/user/create.</summary>
public sealed class LoginTests(MarushApiFactory factory) : IClassFixture<MarushApiFactory>
{
    [Fact]
    public async Task Rule031_ValidLogin_ReturnsATokenForTheConfiguredIssuerAudienceAndExpiry_AndAuditsTheSuccess()
    {
        var account = await StaffAccount.Register(factory);
        using var client = factory.CreateApiClient();

        var token = new JwtSecurityTokenHandler().ReadJwtToken(await account.SignIn(client));

        Assert.Equal("https://issuer.marush.test", token.Issuer);
        Assert.Equal(["https://audience.marush.test"], token.Audiences);
        Assert.InRange(token.ValidTo - DateTime.UtcNow, TimeSpan.FromMinutes(58), TimeSpan.FromMinutes(60));
        var audit = await factory.PublishedEvents.WaitFor<UserAuthenticated>(published => published.Details()[0] == account.Username);
        Assert.Equal("UserAuthenticated", audit.Name);
    }

    // RULE-042: the failure audit is queued in the request's unit of work; it is published only because a 400 still commits.
    [Fact]
    public async Task Rule031_Rule042_WrongPassword_Returns400WithoutAToken_AndTheFailureAuditIsPublished()
    {
        var account = await StaffAccount.Register(factory);
        using var client = factory.CreateApiClient();

        using var response = await client.Post("api/user/login", new { email = account.Username, password = "not-the-password" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.DoesNotContain("token", await response.Content.ReadAsStringAsync(TestContext.Current.CancellationToken), StringComparison.Ordinal);
        var audit = await factory.PublishedEvents.WaitFor<UserAuthenticationFailure>(published => published.Details()[0] == account.Username);
        Assert.Equal("UserUnauthorized", audit.Name);
    }

    [Fact]
    public async Task Rule031_UnknownUser_IsTreatedLikeAWrongPassword()
    {
        var username = $"nobody-{Guid.NewGuid():N}";
        using var client = factory.CreateApiClient();

        using var response = await client.Post("api/user/login", new { email = username, password = "anything" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        _ = await factory.PublishedEvents.WaitFor<UserAuthenticationFailure>(published => published.Details()[0] == username);
    }

    // RULE-030: login and client create carry ValidateCaptchaAttribute too; outside Production no Captcha headers are needed.
    [Fact]
    public async Task Rule030_LoginAndClientCreate_NeedNoCaptchaHeadersOutsideProduction()
    {
        var account = await StaffAccount.Register(factory);
        using var client = factory.CreateApiClient();

        client.UseToken(await account.SignIn(client));
        using var created = await client.Post("api/customer", new CustomerCardBody());

        Assert.Equal(HttpStatusCode.Created, created.StatusCode);
    }

#if DEBUG
    [Fact]
    public async Task Rule041_UserCreation_ExistsInDebugBuilds_AndNeedsNoLogin()
    {
        var username = $"created-{Guid.NewGuid():N}";
        using var client = factory.CreateApiClient();

        using var created = await client.Post("api/user/create", new { email = username, password = "fake-password-for-tests" });
        using var login = await client.Post("api/user/login", new { email = username, password = "fake-password-for-tests" });

        Assert.Equal(HttpStatusCode.OK, created.StatusCode);
        Assert.Equal(HttpStatusCode.OK, login.StatusCode);
    }
#else
    [Fact]
    public async Task Rule041_UserCreation_DoesNotExistInReleaseBuilds()
    {
        using var client = factory.CreateApiClient();

        using var created = await client.Post("api/user/create", new { email = $"created-{Guid.NewGuid():N}", password = "fake-password-for-tests" });

        Assert.Equal(HttpStatusCode.NotFound, created.StatusCode);
    }
#endif
}
