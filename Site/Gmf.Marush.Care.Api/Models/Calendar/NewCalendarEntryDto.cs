namespace Gmf.Marush.Care.Api.Models.Calendar;
public record NewCalendarEntryDto
{
    public DateOnly Date { get; init; }
    public TimeOnly StartTime { get; init; }
    public TimeOnly EndTime { get; init; }
    public Guid? CustomerId { get; init; }
    public Guid? AppointmentId { get; init; }
    public string? Notes { get; init; }
    public decimal? Money { get; init; }
}
