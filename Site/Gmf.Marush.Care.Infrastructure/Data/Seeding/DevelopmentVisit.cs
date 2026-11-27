using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Infrastructure.Data.Seeding;

/// <summary>A seeded visit, placed by its day relative to the Monday of the week the database is seeded in.</summary>
public record DevelopmentVisit(int CustomerIndex, int DaysFromMonday, TimeOnly Start, int Minutes,
    IReadOnlyCollection<string> Treatments, decimal Money, string Description = "")
{
    public CalendarPeriod PeriodIn(DateOnly monday) =>
        new(monday.AddDays(DaysFromMonday), Start, Start.AddMinutes(Minutes));
}
