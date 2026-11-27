namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>The body the public booking page posts to api/appointment. Each booking gets its own email address.</summary>
public sealed record OnlineBooking
{
    public string Name { get; init; } = "Ana";

    public string Surname { get; init; } = "Petrović";

    public string Email { get; init; } = $"client-{Guid.NewGuid():N}@marush.test";

    public string Phone { get; init; } = "0641234567";

    public IReadOnlyList<string> Treatments { get; init; } = ["Dermapen"];

    public IReadOnlyList<string> SerbianTreatments { get; init; } = ["Dermapen"];

    public int Sum { get; init; } = 6500;

    public string Date { get; init; } = string.Empty;

    public string Time { get; init; } = string.Empty;

    public int Duration { get; init; } = 60;

    public static OnlineBooking On(DateOnly date, TimeOnly time) => new()
    {
        Date = WireFormat.Date(date),
        Time = WireFormat.Time(time)
    };
}
