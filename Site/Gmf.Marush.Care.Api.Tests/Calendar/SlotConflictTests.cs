using System.Net;
using Gmf.Marush.Care.Api.Tests.Hosting;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Api.Tests.Calendar;

/// <summary>CalendarRetrievalRepository.IsOccupied: which appointments block an admin entry, and that public booking is never checked.</summary>
public sealed class SlotConflictTests(MarushApiFactory factory) : IClassFixture<MarushApiFactory>
{
    private readonly StoredAppointments _stored = new(factory);
    private readonly ClientCards _cards = new(factory);

    [Fact]
    public async Task Rule033_OverlapReturns409_BackToBackIsAccepted()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var client = await _cards.Create(staff, new CustomerCardBody());
        var day = new DateOnly(2031, 4, 2);

        Assert.Equal(HttpStatusCode.Created, await Place(staff, CalendarEntryBody.ForCustomer(client, day, new TimeOnly(14, 0), new TimeOnly(15, 0))));
        Assert.Equal(HttpStatusCode.Created, await Place(staff, CalendarEntryBody.ForCustomer(client, day, new TimeOnly(15, 0), new TimeOnly(16, 0))));
        Assert.Equal(HttpStatusCode.Created, await Place(staff, CalendarEntryBody.ForCustomer(client, day, new TimeOnly(13, 0), new TimeOnly(14, 0))));
        Assert.Equal(HttpStatusCode.Conflict, await Place(staff, CalendarEntryBody.ForCustomer(client, day, new TimeOnly(14, 30), new TimeOnly(15, 30))));
        Assert.Equal(3, (await _stored.ForCustomer(client)).Count);
    }

    [Fact]
    public async Task Rule033_ARequestedOnlineRequestBlocks_ARejectedOneDoesNot()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var client = await _cards.Create(staff, new CustomerCardBody());
        var day = BookingWindow.Weekday(7);
        var requested = await RequestOnline(day, new TimeOnly(12, 0));
        var rejected = await RequestOnline(day, new TimeOnly(16, 0));
        using var owner = factory.CreateApiClient();
        using var decision = await owner.Get($"api/appointment/decision?appointmentId={rejected}&accepted=false&date=x");

        Assert.Equal(HttpStatusCode.Conflict, await Place(staff, CalendarEntryBody.ForCustomer(client, day, new TimeOnly(12, 30), new TimeOnly(13, 0))));
        Assert.Equal(HttpStatusCode.Created, await Place(staff, CalendarEntryBody.ForCustomer(client, day, new TimeOnly(16, 0), new TimeOnly(17, 0))));
        Assert.NotEqual(Guid.Empty, requested);
    }

    [Fact]
    public async Task Rule033_PublicBookingNeverChecksTheSlot()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var client = await _cards.Create(staff, new CustomerCardBody());
        var day = BookingWindow.Weekday(8);
        Assert.Equal(HttpStatusCode.Created, await Place(staff, CalendarEntryBody.ForCustomer(client, day, new TimeOnly(14, 0), new TimeOnly(15, 0))));

        var first = await RequestOnline(day, new TimeOnly(14, 0));
        var second = await RequestOnline(day, new TimeOnly(14, 0));

        Assert.NotEqual(first, second);
    }

    [Fact]
    public async Task Rule005_AnEntryWithoutAnEndTimeCountsAsOneHour()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var card = new CustomerCardBody();
        var client = await _cards.Create(staff, card);
        var day = new DateOnly(2031, 4, 9);
        Assert.Equal(HttpStatusCode.Created, await Place(staff, CalendarEntryBody.ForCustomer(client, day, new TimeOnly(14, 0), new TimeOnly(14, 15))));
        var appointmentId = (await _stored.SingleForEmail(card.Email)).Id;
        await ClearEndTime(appointmentId);

        Assert.Equal(HttpStatusCode.Conflict, await Place(staff, CalendarEntryBody.ForCustomer(client, day, new TimeOnly(14, 30), new TimeOnly(15, 0))));
        Assert.Equal(HttpStatusCode.Created, await Place(staff, CalendarEntryBody.ForCustomer(client, day, new TimeOnly(15, 0), new TimeOnly(15, 30))));
        var week = await CalendarWeekView.Load(staff, day);
        Assert.Equal(("14:00:00", "15:00:00"), week.EntryTimes(appointmentId));
    }

    [Fact]
    public async Task Rule005_AnOnlineRequestWithoutAnEndTimeIsShownAsOneHour()
    {
        using var staff = await StaffAccount.SignedInClient(factory);
        var day = BookingWindow.Weekday(9);
        var request = await RequestOnline(day, new TimeOnly(18, 30));
        await ClearEndTime(request);

        var week = await CalendarWeekView.Load(staff, day);

        Assert.Equal(("18:30:00", "19:30:00"), week.RequestTimes(request));
    }

    private static async Task<HttpStatusCode> Place(MarushApiClient staff, CalendarEntryBody entry)
    {
        using var response = await staff.Post("api/calendar/entry", entry);
        return response.StatusCode;
    }

    private async Task<Guid> RequestOnline(DateOnly day, TimeOnly time)
    {
        var booking = OnlineBooking.On(day, time);
        using var visitor = factory.CreateApiClient();
        using var response = await visitor.Post("api/appointment", booking);
        _ = response.EnsureSuccessStatusCode();
        return (await _stored.SingleForEmail(booking.Email)).Id;
    }

    // ExpectedEndTime is nullable, but every API path fills it, so the row is edited directly.
    private async Task ClearEndTime(Guid appointmentId) =>
        await factory.ChangeDatabase(async context =>
            (await context.Set<AppointmentDto>().SingleAsync(appointment => appointment.Id == appointmentId, TestContext.Current.CancellationToken))
                .ExpectedEndTime = null);
}
