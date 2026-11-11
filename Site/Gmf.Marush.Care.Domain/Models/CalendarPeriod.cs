namespace Gmf.Marush.Care.Domain.Models;
public record CalendarPeriod(DateOnly Date, TimeOnly StartTime, TimeOnly EndTime)
{
    public string Format(IFormatProvider culture) =>
        $"{Date.ToString("d", culture)} {StartTime.ToString("t", culture)}–{EndTime.ToString("t", culture)}";

    // Back-to-back periods, where one ends exactly when the other starts, do not overlap.
    public bool Overlaps(CalendarPeriod other) =>
        Date == other.Date && StartTime < other.EndTime && other.StartTime < EndTime;
}
