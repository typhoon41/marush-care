using Gmf.Marush.Care.Infrastructure.Data.Configurations.Calendar;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

public record CalendarWeekRange(DateOnly FirstDay, DateOnly LastDay)
{
    public DateTimeOffset Start { get; } = new(FirstDay.ToDateTime(TimeOnly.MinValue), TimeSpan.Zero);
    public DateTimeOffset End { get; } = new(LastDay.ToDateTime(TimeOnly.MaxValue), TimeSpan.Zero);

    public static CalendarWeekRange For(DateOnly weekStart) =>
        new(weekStart, weekStart.AddDays(CalendarEntryConfiguration.WorkingDaysInWeek - 1));
}
