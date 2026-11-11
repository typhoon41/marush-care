using Gmf.Marush.Care.Infrastructure.Data.Configurations.Calendar;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

public record CalendarWeekRange(DateOnly FirstDay, DateOnly LastDay)
{
    public DateTimeOffset Start { get; } = CalendarSchedule.At(FirstDay, TimeOnly.MinValue);
    public DateTimeOffset End { get; } = CalendarSchedule.At(LastDay, TimeOnly.MaxValue);

    public static CalendarWeekRange For(DateOnly weekStart) =>
        new(weekStart, weekStart.AddDays(CalendarEntryConfiguration.WorkingDaysInWeek - 1));
}
