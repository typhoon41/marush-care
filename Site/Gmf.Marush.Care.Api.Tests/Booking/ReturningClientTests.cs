using System.Net;
using Gmf.Marush.Care.Api.Tests.Hosting;

namespace Gmf.Marush.Care.Api.Tests.Booking;

/// <summary>Which client an online request attaches to (Appointment.Service.Schedule, CustomerRetrievalRepository.FindCustomerBy).</summary>
public sealed class ReturningClientTests(MarushApiFactory factory) : IClassFixture<MarushApiFactory>
{
    private readonly StoredAppointments _stored = new(factory);
    private readonly ClientCards _cards = new(factory);

    [Fact]
    public async Task Rule036_SameEmailAndPhone_AttachesToTheExistingClient_AndKeepsTheStoredName()
    {
        var first = OnlineBooking.On(BookingWindow.Weekday(2), new TimeOnly(12, 0)) with { Name = "Ana", Phone = "0641112222" };
        var second = first with { Name = "Anica", Time = WireFormat.Time(new TimeOnly(15, 0)) };

        Assert.Equal(HttpStatusCode.OK, await Book(first));
        Assert.Equal(HttpStatusCode.OK, await Book(second));

        var appointments = await _stored.ForEmail(first.Email);
        Assert.Equal(2, appointments.Count);
        Assert.Single(appointments.Select(appointment => appointment.CustomerId).Distinct());
        Assert.Single(await _cards.AllIdsFor(first.Email));
        Assert.All(appointments, appointment => Assert.Equal("Ana", appointment.Customer.Name));
    }

    [Fact]
    public async Task Rule036_SameEmailWithAnotherPhone_CreatesASecondClient()
    {
        var first = OnlineBooking.On(BookingWindow.Weekday(3), new TimeOnly(12, 0)) with { Phone = "0641234567" };
        var second = first with { Phone = "0659999999" };

        Assert.Equal(HttpStatusCode.OK, await Book(first));
        Assert.Equal(HttpStatusCode.OK, await Book(second));

        Assert.Equal(2, (await _cards.AllIdsFor(first.Email)).Count);
    }

    [Fact]
    public async Task Rule036_SamePhoneWithAnotherEmail_CreatesASecondClient()
    {
        var first = OnlineBooking.On(BookingWindow.Weekday(3), new TimeOnly(13, 0)) with { Phone = "0647778888" };
        var second = OnlineBooking.On(BookingWindow.Weekday(3), new TimeOnly(14, 0)) with { Phone = "0647778888" };

        Assert.Equal(HttpStatusCode.OK, await Book(first));
        Assert.Equal(HttpStatusCode.OK, await Book(second));

        var firstClient = (await _stored.SingleForEmail(first.Email)).CustomerId;
        var secondClient = (await _stored.SingleForEmail(second.Email)).CustomerId;
        Assert.NotEqual(firstClient, secondClient);
    }

    // The incoming email is lower-cased (Customer constructor) before the exact-match lookup.
    [Fact]
    public async Task Rule036_EmailIsLowerCasedBeforeMatching()
    {
        var first = OnlineBooking.On(BookingWindow.Weekday(4), new TimeOnly(12, 0));
        var shouted = first with { Email = first.Email.ToUpperInvariant() };

        Assert.Equal(HttpStatusCode.OK, await Book(first));
        Assert.Equal(HttpStatusCode.OK, await Book(shouted));

        Assert.Equal(2, (await _stored.ForEmail(first.Email)).Count);
        Assert.Single(await _cards.AllIdsFor(first.Email));
    }

    private async Task<HttpStatusCode> Book(OnlineBooking booking)
    {
        using var visitor = factory.CreateApiClient();
        using var response = await visitor.Post("api/appointment", booking);
        return response.StatusCode;
    }
}
