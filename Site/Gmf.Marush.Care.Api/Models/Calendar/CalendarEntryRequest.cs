namespace Gmf.Marush.Care.Api.Models.Calendar;
public record CalendarEntryRequest
{
    public DateOnly Date { get; init; }
    public TimeOnly StartTime { get; init; }
    public TimeOnly EndTime { get; init; }
    public string? ClientName { get; init; }
    public string? ClientPhone { get; init; }
    public string? ClientEmail { get; init; }
    public Guid? CustomerId { get; init; }
    public string? Notes { get; init; }
    public decimal? Money { get; init; }
}
