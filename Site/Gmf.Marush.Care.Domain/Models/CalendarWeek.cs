namespace Gmf.Marush.Care.Domain.Models;
public record CalendarWeek(
    DateOnly Start,
    IEnumerable<CalendarEntry> Entries,
    IEnumerable<CalendarAppointment> PublicAppointments,
    IEnumerable<CalendarNote> Notes)
{
    private const int SundayDayOfWeek = 0;
    private const int DaysFromSundayToMonday = 6;

    public static DateOnly MondayOf(DateOnly date)
    {
        var dayOfWeek = (int)date.DayOfWeek;
        var daysFromMonday = dayOfWeek == SundayDayOfWeek ? DaysFromSundayToMonday : dayOfWeek - 1;
        return date.AddDays(-daysFromMonday);
    }
}
