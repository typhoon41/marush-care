namespace Gmf.Marush.Care.Api.Models.Calendar;
public record CalendarWeekDto(
    DateOnly WeekStart,
    IEnumerable<CalendarEntryDto> Entries,
    IEnumerable<PublicAppointmentDto> PublicAppointments,
    IEnumerable<CalendarNoteDto> Notes);
