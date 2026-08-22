using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Services;
public interface ICalendarService
{
    Task<CalendarWeek> GetWeek(DateOnly weekStart);
    Task CreateEntry(CalendarEntry entry);
    Task<bool> UpdateEntry(Guid id, CalendarEntry entry);
    Task<bool> DeleteEntry(Guid id);
    Task UpsertNote(CalendarNote note);
    Task<bool> DeleteNote(Guid id);
}
