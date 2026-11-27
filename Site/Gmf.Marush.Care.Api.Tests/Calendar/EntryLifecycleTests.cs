using System.Net;
using Gmf.Marush.Care.Api.Tests.Hosting;
using Gmf.Marush.Care.Domain.Enumerations;

namespace Gmf.Marush.Care.Api.Tests.Calendar;

/// <summary>What creating and deleting calendar entries does to appointments (CalendarModificationRepository, CalendarEntryAppointments).</summary>
public sealed class EntryLifecycleTests(MarushApiFactory factory) : IClassFixture<MarushApiFactory>
{
    private readonly StoredAppointments _stored = new(factory);
    private readonly ClientCards _cards = new(factory);

    [Fact]
    public async Task Rule049_AnEntryWithoutARequest_CreatesAnApprovedSerbianAppointmentForTheClient()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var card = new CustomerCardBody { Phones = ["0651111111", "0652222222"] };
        var client = await _cards.Create(staff, card);

        using var response = await staff.Post("api/calendar/entry",
            CalendarEntryBody.ForCustomer(client, new DateOnly(2031, 5, 6), new TimeOnly(11, 0), new TimeOnly(12, 0)));

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var appointment = await _stored.SingleForEmail(card.Email);
        Assert.Equal(client, appointment.CustomerId);
        Assert.Equal(AppointmentStatus.Approved.Value, appointment.Status.Id);
        Assert.Equal("sr", appointment.Language);
        Assert.False(appointment.BookedOnline);
        Assert.Contains(appointment.Phone, card.Phones);
        Assert.Single(await _stored.EntriesFor(appointment.Id));
    }

    [Fact]
    public async Task Rule049_AnEntryForAnUnknownClient_Returns404_AndCreatesNothing()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var unknownClient = Guid.NewGuid();

        using var response = await staff.Post("api/calendar/entry",
            CalendarEntryBody.ForCustomer(unknownClient, new DateOnly(2031, 5, 7), new TimeOnly(11, 0), new TimeOnly(12, 0)));

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        Assert.Empty(await _stored.ForCustomer(unknownClient));
    }

    [Fact]
    public async Task Rule050_PlacingAnOnlineRequestOnTheCalendar_KeepsItRequested_AndMovesItToTheChosenClient()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var chosenClient = await _cards.Create(staff, new CustomerCardBody());
        var booking = OnlineBooking.On(BookingWindow.Weekday(5), new TimeOnly(12, 0));
        using var visitor = factory.CreateApiClient("en");
        using var booked = await visitor.Post("api/appointment", booking);
        var request = await _stored.SingleForEmail(booking.Email);
        var day = new DateOnly(2031, 5, 8);

        using var response = await staff.Post("api/calendar/entry",
            CalendarEntryBody.FromRequest(request.Id, day, new TimeOnly(15, 0), new TimeOnly(16, 30)) with { CustomerId = chosenClient });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var placed = await _stored.ById(request.Id);
        Assert.NotNull(placed);
        Assert.Equal(AppointmentStatus.Requested.Value, placed.Status.Id);
        Assert.True(placed.BookedOnline);
        Assert.Equal(chosenClient, placed.CustomerId);
        Assert.Equal("en", placed.Language);
        // RULE-006: once on the calendar, the time is stored as wall-clock time with a zero offset.
        Assert.Equal(new DateTimeOffset(day, new TimeOnly(15, 0), TimeSpan.Zero), placed.ScheduledFor);
        Assert.Equal(new DateTimeOffset(day, new TimeOnly(16, 30), TimeSpan.Zero), placed.ExpectedEndTime);
        Assert.Single(await _stored.EntriesFor(request.Id));
    }

    [Fact]
    public async Task Rule054_DeletingAnEntry_DeletesItsAppointment_WithoutEmailingTheClient()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var booking = OnlineBooking.On(BookingWindow.Weekday(6), new TimeOnly(13, 0));
        using var visitor = factory.CreateApiClient();
        using var booked = await visitor.Post("api/appointment", booking);
        var request = await _stored.SingleForEmail(booking.Email);
        using var placed = await staff.Post("api/calendar/entry",
            CalendarEntryBody.FromRequest(request.Id, new DateOnly(2031, 5, 9), new TimeOnly(13, 0), new TimeOnly(14, 0)));
        var entryId = Assert.Single(await _stored.EntriesFor(request.Id)).Id;
        var emailsBefore = factory.Emails.DeliveredTo(booking.Email).Count;

        using var response = await staff.Delete($"api/calendar/entry/{entryId}");

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.Null(await _stored.ById(request.Id));
        Assert.Empty(await _stored.EntriesFor(request.Id));
        Assert.Equal(emailsBefore, factory.Emails.DeliveredTo(booking.Email).Count);
    }

    [Fact]
    public async Task Rule054_DeletingAnUnknownEntry_Returns404()
    {
        using var staff = await StaffAccount.SignedInClient(factory);

        using var response = await staff.Delete($"api/calendar/entry/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
