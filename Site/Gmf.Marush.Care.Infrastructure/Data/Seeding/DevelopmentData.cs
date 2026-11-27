using Gmf.Marush.Care.Infrastructure.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data.Seeding;

/// <summary>
/// EF Core seeding for a development database: a login, clients, a calendar around the current week and
/// pending online requests. Runs after every migration, but only fills a database that has no users yet.
/// </summary>
public class DevelopmentData(TimeProvider timeProvider)
{
    private const int DaysInWeek = 7;

    public async Task Seed(DbContext context, bool storeManagementPerformed, CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(context);
        if (await context.Set<UserDto>().AnyAsync(cancellationToken))
        {
            return;
        }

        var now = timeProvider.GetLocalNow();
        var monday = MondayOf(DateOnly.FromDateTime(now.DateTime));
        var administrator = DevelopmentUser.Administrator();
        var customers = DevelopmentCustomers.EditedBy(administrator, now.UtcDateTime);

        _ = context.Add(administrator);
        context.AddRange(customers);
        context.AddRange(DevelopmentCalendarNotes.In(monday));
        await new DevelopmentAppointments(customers, monday).AddTo(context, cancellationToken);
        _ = await context.SaveChangesAsync(cancellationToken);
    }

    private static DateOnly MondayOf(DateOnly day) =>
        day.AddDays(-(((int)day.DayOfWeek + DaysInWeek - (int)DayOfWeek.Monday) % DaysInWeek));
}
