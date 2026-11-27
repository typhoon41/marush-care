using System.Net;
using Gmf.Marush.Care.Api.Tests.Hosting;
using Gmf.Marush.Care.Domain.Events.Calendar;
using Gmf.Marush.Care.Domain.Events.User;

namespace Gmf.Marush.Care.Api.Tests.Calendar;

/// <summary>PUT api/calendar/entry/{id}: a moved entry tells the client after the commit (CalendarService.UpdateEntry, AppointmentRescheduledHandler).</summary>
public sealed class RescheduleTests(MarushApiFactory factory) : IClassFixture<MarushApiFactory>
{
    private readonly StoredAppointments _stored = new(factory);
    private readonly ClientCards _cards = new(factory);

    [Fact]
    public async Task Rule052_Rule053_MovingAnEntry_EmailsTheClientTheOldAndNewTimeInSerbian()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var card = new CustomerCardBody();
        var entry = CalendarEntryBody.ForCustomer(await _cards.Create(staff, card), new DateOnly(2031, 8, 4), new TimeOnly(11, 0), new TimeOnly(12, 0));
        var entryId = await Place(staff, entry, card.Email);

        using var moved = await staff.Put($"api/calendar/entry/{entryId}", entry with
        {
            Date = WireFormat.Date(new DateOnly(2031, 8, 5)),
            StartTime = WireFormat.Time(new TimeOnly(16, 0)),
            EndTime = WireFormat.Time(new TimeOnly(17, 0))
        });

        Assert.Equal(HttpStatusCode.NoContent, moved.StatusCode);
        var email = await factory.Emails.WaitForDeliveryTo(card.Email);
        Assert.Equal("Marush: Space of Care - termin je promenjen", email.Subject);
        Assert.Contains($"{WireFormat.SerbianDate(new DateOnly(2031, 8, 4))} 11:00–12:00", email.Content, StringComparison.Ordinal);
        Assert.Contains($"{WireFormat.SerbianDate(new DateOnly(2031, 8, 5))} 16:00–17:00", email.Content, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Rule052_ANotesOnlyEdit_RaisesNoRescheduledEvent()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var card = new CustomerCardBody();
        var entry = CalendarEntryBody.ForCustomer(await _cards.Create(staff, card), new DateOnly(2031, 8, 6), new TimeOnly(11, 0), new TimeOnly(12, 0));
        var entryId = await Place(staff, entry, card.Email);
        var eventsBefore = factory.PublishedEvents.All.OfType<AppointmentRescheduled>().Count();

        using var edited = await staff.Put($"api/calendar/entry/{entryId}", entry with { Notes = "Bring the voucher" });
        // A login is published through the same background queue, so once it shows up any reschedule event would have too.
        var account = await StaffAccount.Register(factory);
        using var marker = factory.CreateApiClient();
        _ = await account.SignIn(marker);
        _ = await factory.PublishedEvents.WaitFor<UserAuthenticated>(published => published.Details()[0] == account.Username);

        Assert.Equal(HttpStatusCode.NoContent, edited.StatusCode);
        Assert.Equal(eventsBefore, factory.PublishedEvents.All.OfType<AppointmentRescheduled>().Count());
        Assert.Empty(factory.Emails.DeliveredTo(card.Email));
    }

    private async Task<Guid> Place(MarushApiClient staff, CalendarEntryBody entry, string email)
    {
        using var response = await staff.Post("api/calendar/entry", entry);
        _ = response.EnsureSuccessStatusCode();
        var appointment = await _stored.SingleForEmail(email);
        return Assert.Single(await _stored.EntriesFor(appointment.Id)).Id;
    }
}
