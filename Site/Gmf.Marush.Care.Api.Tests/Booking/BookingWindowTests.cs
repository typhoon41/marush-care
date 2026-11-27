using System.Net;
using Gmf.Marush.Care.Api.Tests.Hosting;

namespace Gmf.Marush.Care.Api.Tests.Booking;

/// <summary>AppointmentRequestValidator date and time rules, against the server clock (AppointmentBookingWindow).</summary>
public sealed class BookingWindowTests(MarushApiFactory factory) : IClassFixture<MarushApiFactory>
{
    private static readonly TimeOnly Noon = new(12, 0);

    // Expected status for a date: inside today..today+1 month and Monday to Friday.
    private static HttpStatusCode Verdict(DateOnly date) =>
        date >= BookingWindow.Today && date <= BookingWindow.LastDay && BookingWindow.IsWeekday(date)
            ? HttpStatusCode.OK
            : HttpStatusCode.BadRequest;

    [Fact]
    public async Task Rule017_Today_IsAcceptedOnAWeekday_EvenWhenTheTimeHasPassed()
    {
        var today = BookingWindow.Today;

        var status = await Book(today, Noon);

        Assert.Equal(Verdict(today), status);
    }

    [Fact]
    public async Task Rule017_SameDayNextMonth_IsTheLastDay_TheDayAfterIsRejected()
    {
        var lastDay = BookingWindow.LastDay;
        var firstWeekdayAfter = lastDay.AddDays(1);
        while (!BookingWindow.IsWeekday(firstWeekdayAfter))
        {
            firstWeekdayAfter = firstWeekdayAfter.AddDays(1);
        }

        Assert.Equal(Verdict(lastDay), await Book(lastDay, Noon));
        Assert.Equal(HttpStatusCode.BadRequest, await Book(firstWeekdayAfter, Noon));
    }

    [Fact]
    public async Task Rule017_Yesterday_IsRejected() =>
        Assert.Equal(HttpStatusCode.BadRequest, await Book(BookingWindow.Today.AddDays(-1), Noon));

    [Theory]
    [InlineData(DayOfWeek.Saturday)]
    [InlineData(DayOfWeek.Sunday)]
    public async Task Rule017_WeekendInsideTheWindow_IsRejected(DayOfWeek day) =>
        Assert.Equal(HttpStatusCode.BadRequest, await Book(BookingWindow.Next(day), Noon));

    [Fact]
    public async Task Rule017_AWeekdayInsideTheWindow_IsAccepted() =>
        Assert.Equal(HttpStatusCode.OK, await Book(BookingWindow.Weekday(1), Noon));

    // RULE-019 is marked wrong in RULE_REVIEWS.json (Phase 5 will move the last start to 20:00); this pins today's server rule.
    [Theory]
    [InlineData(12, 0, HttpStatusCode.OK)]
    [InlineData(20, 45, HttpStatusCode.OK)]
    [InlineData(21, 0, HttpStatusCode.BadRequest)]
    [InlineData(11, 45, HttpStatusCode.BadRequest)]
    [InlineData(12, 10, HttpStatusCode.BadRequest)]
    public async Task Rule019_StartHour12To20_OnQuarterHours(int hour, int minute, HttpStatusCode expected) =>
        Assert.Equal(expected, await Book(BookingWindow.Weekday(2), new TimeOnly(hour, minute)));

    // RULE-021 is marked wrong (Phase 5 anchors the regex); "0641234567abc" passing is the half-anchored regex today.
    [Theory]
    [InlineData("0641234567", HttpStatusCode.OK)]
    [InlineData("+381641234567", HttpStatusCode.OK)]
    [InlineData("0641234567abc", HttpStatusCode.OK)]
    [InlineData("abc+38164123456", HttpStatusCode.OK)]
    [InlineData("0123", HttpStatusCode.BadRequest)]
    [InlineData("0641234567abcdefg", HttpStatusCode.BadRequest)]
    public async Task Rule021_PhoneRegexIsHalfAnchored_MaximumSixteenCharacters(string phone, HttpStatusCode expected)
    {
        using var visitor = factory.CreateApiClient();

        using var response = await visitor.Post("api/appointment", OnlineBooking.On(BookingWindow.Weekday(2), Noon) with { Phone = phone });

        Assert.Equal(expected, response.StatusCode);
    }

    // RULE-030: ValidateCaptchaAttribute skips the check outside Production, so no Captcha/CaptchaAction headers are needed here.
    [Fact]
    public async Task Rule030_CaptchaIsSkippedOutsideProduction()
    {
        using var visitor = factory.CreateApiClient();

        using var response = await visitor.Post("api/appointment", OnlineBooking.On(BookingWindow.Weekday(1), Noon));

        Assert.Equal("Test", MarushApiFactory.EnvironmentName);
        Assert.False(response.RequestMessage?.Headers.Contains("Captcha"));
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    private async Task<HttpStatusCode> Book(DateOnly date, TimeOnly time)
    {
        using var visitor = factory.CreateApiClient();
        using var response = await visitor.Post("api/appointment", OnlineBooking.On(date, time));
        return response.StatusCode;
    }
}
