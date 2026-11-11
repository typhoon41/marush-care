using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Repositories;
public interface ICalendarModificationRepository
{
    Task<bool> AddEntry(CalendarEntry entry);
    Task<bool> UpdateEntry(Guid id, CalendarEntry entry);
    Task<bool> DeleteEntry(Guid id);
    Task UpsertNote(CalendarNote note);
    Task<bool> DeleteNote(Guid id);
}
