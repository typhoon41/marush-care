using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Api.Models.Calendar;
public record CalendarWeekDto(
    DateOnly WeekStart,
    IEnumerable<CalendarEntryDto> Entries,
    IEnumerable<PublicAppointmentDto> PublicAppointments,
    IEnumerable<CalendarNoteDto> Notes)
{
    public static CalendarWeekDto MapFrom(CalendarWeek week) => new(week.Start,
        week.Entries.Select(CalendarEntryDto.MapFrom),
        week.PublicAppointments.Select(PublicAppointmentDto.MapFrom),
        week.Notes.Select(CalendarNoteDto.MapFrom));
}
