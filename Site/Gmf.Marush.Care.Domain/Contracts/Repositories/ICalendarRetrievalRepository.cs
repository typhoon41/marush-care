using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Repositories;
public interface ICalendarRetrievalRepository
{
    Task<IEnumerable<CalendarEntry>> GetEntriesForWeek(DateOnly weekStart);
    Task<CalendarEntry?> GetEntryById(Guid id);
    Task<IEnumerable<CalendarNote>> GetNotesForWeek(DateOnly weekStart);
    Task<IEnumerable<CalendarAppointment>> GetPublicAppointmentsForWeek(DateOnly weekStart);
    Task<(string Email, string Language)?> GetAppointmentContact(Guid appointmentId);
}
