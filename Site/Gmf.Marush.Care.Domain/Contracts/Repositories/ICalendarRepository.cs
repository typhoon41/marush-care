using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Repositories;
public interface ICalendarRepository
{
    Task<IEnumerable<CalendarEntry>> GetEntriesForWeekAsync(DateOnly weekStart);
    Task<CalendarEntry?> GetEntryByIdAsync(Guid id);
    Task AddEntryAsync(CalendarEntry entry);
    Task UpdateEntryAsync(Guid id, CalendarEntry entry);
    Task<bool> DeleteEntryAsync(Guid id);
    Task UpsertNoteAsync(CalendarNote note);
    Task<bool> DeleteNoteAsync(Guid id);
    Task<IEnumerable<CalendarNote>> GetNotesForWeekAsync(DateOnly weekStart);
    Task<IEnumerable<CalendarAppointment>> GetPublicAppointmentsForWeekAsync(DateOnly weekStart);
}
