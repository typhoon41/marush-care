namespace Gmf.Marush.Care.Api.Models.Calendar;
public record CalendarEntryDto(
    Guid Id,
    Guid AppointmentId,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime,
    string? Notes,
    decimal? Money);
