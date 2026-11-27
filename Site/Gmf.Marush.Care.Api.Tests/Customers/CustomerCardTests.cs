using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Gmf.Marush.Care.Api.Tests.Hosting;
using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Api.Tests.Customers;

/// <summary>The client card (api/customer): which visits it shows and what saving it does (CustomerModificationRepository.SetAppointmentsFor).</summary>
public sealed class CustomerCardTests(MarushApiFactory factory) : IClassFixture<MarushApiFactory>
{
    private readonly StoredAppointments _stored = new(factory);
    private readonly ClientCards _cards = new(factory);

    [Fact]
    public async Task Rule056_SavingTheCard_AddsPerformedVisits_KeepsListedOnes_AndDeletesEveryUnlistedAppointment()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var card = new CustomerCardBody { Phones = ["0653334444"] };
        var client = await _cards.Create(staff, card);
        var calendarVisit = new DateOnly(2031, 6, 10);
        using var placed = await staff.Post("api/calendar/entry",
            CalendarEntryBody.ForCustomer(client, calendarVisit, new TimeOnly(12, 0), new TimeOnly(13, 0)));
        var requestDay = BookingWindow.Weekday(10);
        using var visitor = factory.CreateApiClient();
        using var booked = await visitor.Post("api/appointment", OnlineBooking.On(requestDay, new TimeOnly(12, 0)) with
        {
            Email = card.Email,
            Phone = card.Phones[0]
        });
        Assert.Equal(2, (await _stored.ForCustomer(client)).Count);
        var historyVisit = new DateOnly(2026, 11, 1);

        using var saved = await staff.Put("api/customer", card with
        {
            Id = client,
            Appointments = [CustomerCardVisit.On(calendarVisit, "Facial"), CustomerCardVisit.On(historyVisit, "Peeling")]
        });

        Assert.Equal(HttpStatusCode.NoContent, saved.StatusCode);
        var appointments = await _stored.ForCustomer(client);
        Assert.Equal(2, appointments.Count);
        var kept = Assert.Single(appointments, appointment => appointment.Status.Id == AppointmentStatus.Approved.Value);
        Assert.Equal("Facial", kept.Description);
        var added = Assert.Single(appointments, appointment => appointment.Status.Id == AppointmentStatus.Performed.Value);
        Assert.Equal(new DateTimeOffset(historyVisit, TimeOnly.MinValue, TimeSpan.Zero), added.ScheduledFor);
        Assert.Equal(new DateTimeOffset(historyVisit, TimeOnly.MaxValue, TimeSpan.Zero), added.ExpectedEndTime);
        Assert.Equal("sr", added.Language);
        Assert.DoesNotContain(appointments, appointment => appointment.Status.Id == AppointmentStatus.Requested.Value);
    }

    [Fact]
    public async Task Rule044_TheCardListsOnlyExecutedVisits_ApprovedAndPerformed()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var card = new CustomerCardBody { Phones = ["0655556666"], Appointments = [CustomerCardVisit.On(new DateOnly(2026, 10, 1), "Massage")] };
        var client = await _cards.Create(staff, card);
        using var placed = await staff.Post("api/calendar/entry",
            CalendarEntryBody.ForCustomer(client, new DateOnly(2031, 6, 11), new TimeOnly(12, 0), new TimeOnly(13, 0)));
        using var visitor = factory.CreateApiClient();
        using var booked = await visitor.Post("api/appointment",
            OnlineBooking.On(BookingWindow.Weekday(11), new TimeOnly(12, 0)) with { Email = card.Email, Phone = card.Phones[0] });

        var shown = await VisitDates(staff, client);

        Assert.Equal(3, (await _stored.ForCustomer(client)).Count);
        Assert.Equal([WireFormat.SerbianDate(new DateOnly(2031, 6, 11)), WireFormat.SerbianDate(new DateOnly(2026, 10, 1))], shown);
    }

    [Fact]
    public async Task Rule044_TheFourStatusesAreSeededWithFixedIds()
    {
        var statuses = await factory.QueryDatabase(async context => await context.Set<AppointmentStatusDto>()
            .OrderBy(status => status.Name)
            .Select(status => $"{status.Name}={status.Id}")
            .ToListAsync(TestContext.Current.CancellationToken));

        Assert.Equal([
            "Approved=b14a3e57-15c6-4de2-bd70-431e00e14520",
            "Performed=4f8b1835-c724-4635-bef7-30b2f1c37965",
            "Rejected=26c7dd9f-b501-4116-8438-00a5549d2555",
            "Requested=c932c2d0-ac07-4f10-a1f9-a934175881f2"], statuses);
    }

    [Fact]
    public async Task Rule039_AnyLoggedInUser_GetsTheFullRecord_IncludingMedicalFields()
    {
        using var creator = await StaffAccount.SignedInClient(factory);
        var card = new CustomerCardBody { Diagnosis = "Psoriasis", Allergies = "Nickel" };
        var client = await _cards.Create(creator, card);
        using var colleague = await StaffAccount.SignedInClient(factory);

        using var response = await colleague.Get($"api/customer/{client}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var record = await response.Content.ReadFromJsonAsync<JsonElement>(TestContext.Current.CancellationToken);
        Assert.Equal("Psoriasis", record.GetProperty("diagnosis").GetString());
        Assert.Equal("Nickel", record.GetProperty("allergies").GetString());
        Assert.Equal(card.Email, record.GetProperty("emails")[0].GetString());
    }

    private static async Task<IReadOnlyList<string?>> VisitDates(MarushApiClient staff, Guid client)
    {
        using var response = await staff.Get($"api/customer/{client}");
        var record = await response.Content.ReadFromJsonAsync<JsonElement>(TestContext.Current.CancellationToken);
        return [.. record.GetProperty("appointments").EnumerateArray().Select(visit => visit.GetProperty("date").GetString())];
    }
}
