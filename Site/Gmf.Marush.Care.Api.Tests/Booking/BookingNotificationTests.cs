using System.Net;
using Gmf.Marush.Care.Api.Tests.Hosting;

namespace Gmf.Marush.Care.Api.Tests.Booking;

/// <summary>
/// The two emails of an online request (AppointmentNotificationService.SendAppointmentNotificationTo). RULE-046 is marked
/// wrong in RULE_REVIEWS.json (Phase 5 changes the email order and atomicity); these tests pin today's behavior.
/// </summary>
public sealed class BookingNotificationTests(MarushApiFactory factory) : IClassFixture<MarushApiFactory>
{
    private const string OwnerSubject = "Marush: Space of Care - zahtev za zakazivanje termina";
    private const string SerbianCustomerSubject = "Marush: Space of Care - zahtev za zakazivanje termina je podnet";

    private readonly StoredAppointments _stored = new(factory);

    [Fact]
    public async Task Rule046_BothEmailsAreSent_TheOwnerFirst_ThenTheCustomer()
    {
        var booking = OnlineBooking.On(BookingWindow.Weekday(2), new TimeOnly(17, 0)) with { Surname = $"Owner-first-{Guid.NewGuid():N}" };
        using var visitor = factory.CreateApiClient();

        using var response = await visitor.Post("api/appointment", booking);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var appointmentId = (await _stored.SingleForEmail(booking.Email)).Id.ToString();
        var delivered = factory.Emails.Delivered.ToList();
        var ownerIndex = delivered.FindIndex(message => message.Content.Contains(appointmentId, StringComparison.Ordinal));
        var customerIndex = delivered.FindIndex(message => message.To.Contains(booking.Email));
        Assert.True(ownerIndex >= 0 && customerIndex > ownerIndex, $"owner email at {ownerIndex}, customer email at {customerIndex}");
        Assert.Equal([MarushApiFactory.OwnerAddress], delivered[ownerIndex].To);
        Assert.Equal(OwnerSubject, delivered[ownerIndex].Subject);
        Assert.Equal(SerbianCustomerSubject, delivered[customerIndex].Subject);
    }

    [Fact]
    public async Task Rule046_CustomerEmailFails_NothingIsSaved_ButTheOwnerAlreadyHasTheEmail()
    {
        var booking = OnlineBooking.On(BookingWindow.Weekday(3), new TimeOnly(17, 0)) with { Surname = $"Unreachable-{Guid.NewGuid():N}" };
        factory.Emails.MakeUnreachable(booking.Email);
        using var visitor = factory.CreateApiClient();

        using var response = await visitor.Post("api/appointment", booking);

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        Assert.Empty(await _stored.ForEmail(booking.Email));
        Assert.Contains(factory.Emails.DeliveredTo(MarushApiFactory.OwnerAddress),
            message => message.Content.Contains(booking.Surname, StringComparison.Ordinal));
        Assert.Contains(factory.Emails.Failed, message => message.To.Contains(booking.Email));
    }
}
