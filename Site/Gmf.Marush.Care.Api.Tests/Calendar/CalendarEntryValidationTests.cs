using System.Globalization;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Gmf.Marush.Care.Api.Tests.Hosting;

namespace Gmf.Marush.Care.Api.Tests.Calendar;

/// <summary>NewCalendarEntryDtoValidator: money limits and the admin time grid (POST api/calendar/entry).</summary>
public sealed class CalendarEntryValidationTests(MarushApiFactory factory) : IClassFixture<MarushApiFactory>
{
    private const string SerbianMoneyMessage = "Iznos mora biti između 0 i 99.999.999,99 RSD.";

    private readonly StoredAppointments _stored = new(factory);
    private readonly ClientCards _cards = new(factory);

    [Fact]
    public async Task Rule004_MoneyAboveTheMaximum_Returns400WithTheSerbianMessage()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var entry = CalendarEntryBody.ForCustomer(await _cards.Create(staff, new CustomerCardBody()),
            new DateOnly(2031, 3, 3), new TimeOnly(12, 0), new TimeOnly(13, 0)) with { Money = 100_000_000.00m };

        using var response = await staff.Post("api/calendar/entry", entry);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal([SerbianMoneyMessage], await Errors(response, "money"));
    }

    // Observed: the message is formatted with the request culture, so an English request reads "99,999,999.99".
    [Fact]
    public async Task Rule004_TheMoneyMessageNumberFollowsTheRequestCulture()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        using var english = await StaffAccount.SignedInClient(factory, "en");
        var entry = CalendarEntryBody.ForCustomer(await _cards.Create(staff, new CustomerCardBody()),
            new DateOnly(2031, 3, 4), new TimeOnly(12, 0), new TimeOnly(13, 0)) with { Money = -0.01m };

        using var response = await english.Post("api/calendar/entry", entry);

        Assert.Equal(["Iznos mora biti između 0 i 99,999,999.99 RSD."], await Errors(response, "money"));
    }

    [Theory]
    [InlineData("12500.50", 12)]
    [InlineData("99999999.99", 13)]
    [InlineData("0", 14)]
    [InlineData(null, 15)]
    public async Task Rule004_MoneyInsideTheLimits_IsStoredAsSent(string? money, int hour)
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var card = new CustomerCardBody();
        var amount = money is null ? (decimal?)null : decimal.Parse(money, CultureInfo.InvariantCulture);
        var entry = CalendarEntryBody.ForCustomer(await _cards.Create(staff, card),
            new DateOnly(2031, 3, 5), new TimeOnly(hour, 0), new TimeOnly(hour, 30)) with { Money = amount };

        using var response = await staff.Post("api/calendar/entry", entry);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.Equal(amount, (await _stored.SingleForEmail(card.Email)).Money);
    }

    // RULE-023 is marked wrong (Phase 5 blocks Sundays for admin entries); today a Sunday entry is accepted.
    [Fact]
    public async Task Rule023_AnEntryOnASunday_IsAccepted()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var sunday = new DateOnly(2031, 3, 9);
        var entry = CalendarEntryBody.ForCustomer(await _cards.Create(staff, new CustomerCardBody()), sunday, new TimeOnly(12, 0), new TimeOnly(13, 0));

        using var response = await staff.Post("api/calendar/entry", entry);

        Assert.Equal(DayOfWeek.Sunday, sunday.DayOfWeek);
        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Theory]
    [InlineData(18, 0, 22, 0, null, null)]
    [InlineData(17, 45, 22, 0, "endTime", "Termin ne može trajati duže od 4 sata.")]
    [InlineData(18, 0, 22, 15, "endTime", "Vreme kraja mora biti između 11:00 i 22:00.")]
    [InlineData(14, 10, 15, 10, "startTime", "Vreme početka mora biti na 15 minuta.")]
    [InlineData(10, 45, 11, 45, "startTime", "Vreme početka mora biti između 11:00 i 22:00.")]
    [InlineData(14, 0, 14, 0, "endTime", "Vreme kraja mora biti posle vremena početka.")]
    public async Task Rule023_AdminGrid_11To22_QuarterHours_AtMostFourHours(int startHour, int startMinute, int endHour, int endMinute,
        string? field, string? message)
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var entry = CalendarEntryBody.ForCustomer(await _cards.Create(staff, new CustomerCardBody()), new DateOnly(2031, 3, 6),
            new TimeOnly(startHour, startMinute), new TimeOnly(endHour, endMinute));

        using var response = await staff.Post("api/calendar/entry", entry);

        if (field is null)
        {
            Assert.Equal(HttpStatusCode.Created, response.StatusCode);
            return;
        }

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Contains(message, await Errors(response, field));
    }

    private static async Task<IReadOnlyList<string?>> Errors(HttpResponseMessage response, string field)
    {
        var body = await response.Content.ReadFromJsonAsync<JsonElement>(TestContext.Current.CancellationToken);
        return [.. body.GetProperty("errors").GetProperty(field).EnumerateArray().Select(error => error.GetString())];
    }
}
