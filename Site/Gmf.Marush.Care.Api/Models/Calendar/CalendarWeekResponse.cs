namespace Gmf.Marush.Care.Api.Models.Calendar;
public record CalendarWeekResponse(
    DateOnly WeekStart,
    IEnumerable<CalendarEntryResponse> Entries,
    IEnumerable<PublicAppointmentResponse> PublicAppointments,
    IEnumerable<CalendarNoteResponse> Notes);
