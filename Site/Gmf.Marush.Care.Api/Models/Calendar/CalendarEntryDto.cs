using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Api.Models.Calendar;
public record CalendarEntryDto(
    Guid Id,
    Guid AppointmentId,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime,
    string? Notes,
    decimal? Money,
    IEnumerable<string> Treatments,
    string ClientName)
{
    public static CalendarEntryDto MapFrom(CalendarEntry entry) => new(entry.Id, entry.AppointmentId!.Value,
        entry.Date, entry.StartTime, entry.EndTime, entry.Notes, entry.Money, entry.Treatments, entry.ClientName);
}
