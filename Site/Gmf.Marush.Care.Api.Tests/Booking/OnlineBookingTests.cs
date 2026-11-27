using System.Net;
using Gmf.Marush.Care.Api.Tests.Hosting;
using Gmf.Marush.Care.Domain.Enumerations;

namespace Gmf.Marush.Care.Api.Tests.Booking;

/// <summary>POST api/appointment: what an online request stores (AppointmentController.Post, AppointmentRepository.Create).</summary>
public sealed class OnlineBookingTests(MarushApiFactory factory) : IClassFixture<MarushApiFactory>
{
    private readonly StoredAppointments _stored = new(factory);

    [Fact]
    public async Task Rule002_EndIsStartPlusDuration_StoredAsUtcOfServerLocalTime()
    {
        var date = BookingWindow.Weekday(3);
        var booking = OnlineBooking.On(date, new TimeOnly(14, 30)) with { Duration = 120 };
        using var visitor = factory.CreateApiClient();

        using var response = await visitor.Post("api/appointment", booking);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var stored = await _stored.SingleForEmail(booking.Email);
        var localStart = new DateTimeOffset(date.ToDateTime(new TimeOnly(14, 30), DateTimeKind.Local));
        Assert.Equal(TimeSpan.Zero, stored.ScheduledFor.Offset);
        Assert.Equal(localStart.UtcDateTime, stored.ScheduledFor.UtcDateTime);
        Assert.Equal(localStart.AddMinutes(120).UtcDateTime, stored.ExpectedEndTime?.UtcDateTime);
    }

    [Theory]
    [InlineData(1, 600)]
    [InlineData(0, 0)]
    [InlineData(99_999_999, 30)]
    public async Task Rule003_SumAndDurationAreStoredUnchecked(int sum, int duration)
    {
        var booking = OnlineBooking.On(BookingWindow.Weekday(4), new TimeOnly(12, 0)) with { Sum = sum, Duration = duration };
        using var visitor = factory.CreateApiClient();

        using var response = await visitor.Post("api/appointment", booking);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var stored = await _stored.SingleForEmail(booking.Email);
        Assert.Equal(sum, stored.Money);
        Assert.Equal(TimeSpan.FromMinutes(duration), stored.ExpectedEndTime - stored.ScheduledFor);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(100_000_000)]
    public async Task Rule003_SumOutsideZeroToMaximumWholeMoney_Returns400(int sum)
    {
        var booking = OnlineBooking.On(BookingWindow.Weekday(4), new TimeOnly(12, 0)) with { Sum = sum };
        using var visitor = factory.CreateApiClient();

        using var response = await visitor.Post("api/appointment", booking);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Empty(await _stored.ForEmail(booking.Email));
    }

    // Observed: Duration has no validator rule; a negative one makes Period throw, which surfaces as a 500 and emails the developer.
    [Fact]
    public async Task Rule003_NegativeDuration_Returns500_SavesNothing_AndEmailsTheDeveloper()
    {
        var booking = OnlineBooking.On(BookingWindow.Weekday(4), new TimeOnly(13, 0)) with { Duration = -30 };
        using var visitor = factory.CreateApiClient();
        var developerEmailsBefore = factory.Emails.DeliveredTo(MarushApiFactory.DeveloperAddress).Count;

        using var response = await visitor.Post("api/appointment", booking);

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Empty(await _stored.ForEmail(booking.Email));
        var developerEmails = factory.Emails.DeliveredTo(MarushApiFactory.DeveloperAddress);
        Assert.Equal(developerEmailsBefore + 1, developerEmails.Count);
        Assert.Equal("Unhandled exception occurred!", developerEmails[^1].Subject);
    }

    [Fact]
    public async Task Rule044_Rule045_OnlineRequestIsStoredRequested_BookedOnline_WithVisitorLanguage()
    {
        var booking = OnlineBooking.On(BookingWindow.Weekday(5), new TimeOnly(15, 0)) with
        {
            Treatments = ["Hydrafacial treatment"],
            SerbianTreatments = ["Hidrafacijalni tretman"],
            Sum = 4500,
            Duration = 90
        };
        using var visitor = factory.CreateApiClient("en");

        using var response = await visitor.Post("api/appointment", booking);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var stored = await _stored.SingleForEmail(booking.Email);
        Assert.Equal(AppointmentStatus.Requested.Value, stored.Status.Id);
        Assert.True(stored.BookedOnline);
        Assert.Equal("en", stored.Language);
        Assert.Equal(4500m, stored.Money);
        Assert.Equal(["Hidrafacijalni tretman"], stored.TreatmentNames());
        Assert.Equal(booking.Phone, stored.Phone);
    }

    [Theory]
    [InlineData("de", "sr")]
    [InlineData("ru", "ru")]
    public async Task Rule045_UnsupportedLanguageFallsBackToSerbian(string acceptLanguage, string storedLanguage)
    {
        var booking = OnlineBooking.On(BookingWindow.Weekday(5), new TimeOnly(16, 0));
        using var visitor = factory.CreateApiClient(acceptLanguage);

        using var response = await visitor.Post("api/appointment", booking);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(storedLanguage, (await _stored.SingleForEmail(booking.Email)).Language);
    }
}
