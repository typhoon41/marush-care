namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>The body the admin calendar posts to api/calendar/entry (create) and puts to api/calendar/entry/{id} (edit).</summary>
public sealed record CalendarEntryBody
{
    public string Date { get; init; } = string.Empty;

    public string StartTime { get; init; } = string.Empty;

    public string EndTime { get; init; } = string.Empty;

    public Guid? CustomerId { get; init; }

    public Guid? AppointmentId { get; init; }

    public string? Notes { get; init; }

    public decimal? Money { get; init; }

    public IReadOnlyList<string> Treatments { get; init; } = [];

    public static CalendarEntryBody ForCustomer(Guid customerId, DateOnly date, TimeOnly start, TimeOnly end) => new()
    {
        CustomerId = customerId,
        Date = WireFormat.Date(date),
        StartTime = WireFormat.Time(start),
        EndTime = WireFormat.Time(end)
    };

    public static CalendarEntryBody FromRequest(Guid appointmentId, DateOnly date, TimeOnly start, TimeOnly end) => new()
    {
        AppointmentId = appointmentId,
        Date = WireFormat.Date(date),
        StartTime = WireFormat.Time(start),
        EndTime = WireFormat.Time(end)
    };
}
