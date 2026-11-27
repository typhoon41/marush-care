using System.Net;
using Gmf.Marush.Care.Api.Tests.Hosting;
using Gmf.Marush.Care.Domain.Enumerations;

namespace Gmf.Marush.Care.Api.Tests.Booking;

/// <summary>GET api/appointment/decision: the owner's accept/reject link (AppointmentController.Decision).</summary>
public sealed class AppointmentDecisionTests(MarushApiFactory factory) : IClassFixture<MarushApiFactory>
{
    private const string ClientNotifiedPage = "https://marushcare.com/sr/klijent-obave%C5%A1ten";
    private const string SystemErrorPage = "https://marushcare.com/sr/gre%C5%A1ka/sistemska";

    private readonly StoredAppointments _stored = new(factory);

    [Fact]
    public async Task Rule037_Rule042_AcceptLinkIsAnAnonymousGet_Redirects302ToTheSerbianPage_AndTheApprovalIsCommitted()
    {
        var (booking, appointmentId) = await RequestAppointment("sr");
        var links = await OwnerDecisionLinks.For(factory, appointmentId);
        using var owner = factory.CreateApiClient();

        using var response = await owner.Get(links.Accept.AbsoluteUri);

        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        Assert.Equal(ClientNotifiedPage, Assert.Single(response.Headers.GetValues("Location")));
        Assert.Equal(AppointmentStatus.Approved.Value, (await _stored.ById(appointmentId))?.Status.Id);
        var confirmation = Assert.Single(factory.Emails.DeliveredTo(booking.Email), message => message.Subject.EndsWith("je odobren", StringComparison.Ordinal));
        Assert.Contains("Višegradska 25/7", confirmation.Content, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Rule037_TheDateInTheConfirmationEmailIsTakenFromTheQueryString()
    {
        var (booking, appointmentId) = await RequestAppointment("sr");
        using var owner = factory.CreateApiClient();

        using var response = await owner.Get($"api/appointment/decision?appointmentId={appointmentId}&accepted=true&date=01.01.2000 any text");

        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        var confirmation = factory.Emails.DeliveredTo(booking.Email)[^1];
        Assert.Contains("01.01.2000 any text", confirmation.Content, StringComparison.Ordinal);
    }

    // The {{date}} placeholder sits inside the AppointmentRejectedText resource, which is replaced before {{date}} is.
    [Fact]
    public async Task Rule037_RejectLink_SetsRejected_SendsTheRejectionEmailInTheStoredLanguage_WithTheQueryDate()
    {
        var (booking, appointmentId) = await RequestAppointment("en");
        using var owner = factory.CreateApiClient();

        using var response = await owner.Get($"api/appointment/decision?appointmentId={appointmentId}&accepted=false&date=31.12.2099 marker");

        Assert.Equal(ClientNotifiedPage, Assert.Single(response.Headers.GetValues("Location")));
        Assert.Equal(AppointmentStatus.Rejected.Value, (await _stored.ById(appointmentId))?.Status.Id);
        var rejection = factory.Emails.DeliveredTo(booking.Email)[^1];
        Assert.Equal("Marush: Space of Care - appointment request has been rejected", rejection.Subject);
        Assert.Contains("has rejected your request for 31.12.2099 marker", rejection.Content, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Rule047_DecisionOnlyFromRequested_SecondDecisionChangesNothing()
    {
        var (booking, appointmentId) = await RequestAppointment("sr");
        var links = await OwnerDecisionLinks.For(factory, appointmentId);
        using var owner = factory.CreateApiClient();
        using var accepted = await owner.Get(links.Accept.AbsoluteUri);
        var emailsAfterAccept = factory.Emails.DeliveredTo(booking.Email).Count;

        using var rejected = await owner.Get(links.Reject.AbsoluteUri);

        Assert.Equal(SystemErrorPage, Assert.Single(rejected.Headers.GetValues("Location")));
        Assert.Equal(AppointmentStatus.Approved.Value, (await _stored.ById(appointmentId))?.Status.Id);
        Assert.Equal(emailsAfterAccept, factory.Emails.DeliveredTo(booking.Email).Count);
    }

    [Fact]
    public async Task Rule047_UnknownAppointment_RedirectsToTheErrorPage()
    {
        using var owner = factory.CreateApiClient();

        using var response = await owner.Get($"api/appointment/decision?appointmentId={Guid.NewGuid()}&accepted=true&date=01.01.2030");

        Assert.Equal(HttpStatusCode.Redirect, response.StatusCode);
        Assert.Equal(SystemErrorPage, Assert.Single(response.Headers.GetValues("Location")));
    }

    // RULE-048: a failed send detaches the decision, so the request stays Requested and can be decided again.
    [Fact]
    public async Task Rule047_Rule048_FailedDecisionEmail_LeavesTheRequestRequested()
    {
        var (booking, appointmentId) = await RequestAppointment("ru");
        factory.Emails.MakeUnreachable(booking.Email);
        using var owner = factory.CreateApiClient();

        using var response = await owner.Get($"api/appointment/decision?appointmentId={appointmentId}&accepted=true&date=01.01.2030");

        Assert.Equal(SystemErrorPage, Assert.Single(response.Headers.GetValues("Location")));
        Assert.Equal(AppointmentStatus.Requested.Value, (await _stored.ById(appointmentId))?.Status.Id);
    }

    [Fact]
    public async Task Rule037_MissingDate_Returns400()
    {
        var (_, appointmentId) = await RequestAppointment("sr");
        using var owner = factory.CreateApiClient();

        using var response = await owner.Get($"api/appointment/decision?appointmentId={appointmentId}&accepted=true");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal(AppointmentStatus.Requested.Value, (await _stored.ById(appointmentId))?.Status.Id);
    }

    private async Task<(OnlineBooking Booking, Guid AppointmentId)> RequestAppointment(string language)
    {
        var booking = OnlineBooking.On(BookingWindow.Weekday(6), new TimeOnly(18, 15));
        using var visitor = factory.CreateApiClient(language);
        using var response = await visitor.Post("api/appointment", booking);
        _ = response.EnsureSuccessStatusCode();
        return (booking, (await _stored.SingleForEmail(booking.Email)).Id);
    }
}
