using Gmf.Marush.Care.Infrastructure.Data.Configurations.Calendar;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

public record CalendarWeekRange(DateOnly FirstDay, DateOnly LastDay)
{
    private readonly CalendarSlot _slot = CalendarSlot.Spanning(FirstDay, LastDay);

    public DateTimeOffset Start => _slot.Start;
    public DateTimeOffset End => _slot.End;

    public static CalendarWeekRange For(DateOnly weekStart) =>
        new(weekStart, weekStart.AddDays(CalendarEntryConfiguration.WorkingDaysInWeek - 1));
}
