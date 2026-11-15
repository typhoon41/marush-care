using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;

/// <summary>
/// A stretch of calendar time in both forms an appointment record stores it. A calendar entry keeps
/// the wall-clock time it shows, tagged with a zero offset. An online request keeps the instant that
/// wall-clock time has in the server's time zone, which is how the public booking endpoint builds it.
/// </summary>
public record CalendarSlot(DateTimeOffset Start, DateTimeOffset End, DateTimeOffset RequestedStart, DateTimeOffset RequestedEnd)
{
    public static CalendarSlot Of(CalendarPeriod period) =>
        Between(period.Date.ToDateTime(period.StartTime), period.Date.ToDateTime(period.EndTime));

    public static CalendarSlot Spanning(DateOnly firstDay, DateOnly lastDay) =>
        Between(firstDay.ToDateTime(TimeOnly.MinValue), lastDay.ToDateTime(TimeOnly.MaxValue));

    private static CalendarSlot Between(DateTime start, DateTime end) => new(
        new DateTimeOffset(start, TimeSpan.Zero),
        new DateTimeOffset(end, TimeSpan.Zero),
        new DateTimeOffset(DateTime.SpecifyKind(start, DateTimeKind.Local)),
        new DateTimeOffset(DateTime.SpecifyKind(end, DateTimeKind.Local)));
}
