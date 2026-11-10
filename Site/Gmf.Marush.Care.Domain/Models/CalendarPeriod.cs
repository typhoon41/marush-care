namespace Gmf.Marush.Care.Domain.Models;
public record CalendarPeriod(DateOnly Date, TimeOnly StartTime, TimeOnly EndTime)
{
    public string Format(IFormatProvider culture) =>
        $"{Date.ToString("d", culture)} {StartTime.ToString("t", culture)}–{EndTime.ToString("t", culture)}";
}
