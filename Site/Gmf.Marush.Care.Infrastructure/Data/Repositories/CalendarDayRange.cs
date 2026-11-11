namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

public record CalendarDayRange(DateOnly Day)
{
    public DateTimeOffset Start { get; } = new(Day.ToDateTime(TimeOnly.MinValue), TimeSpan.Zero);
    public DateTimeOffset End { get; } = new(Day.ToDateTime(TimeOnly.MaxValue), TimeSpan.Zero);
}
