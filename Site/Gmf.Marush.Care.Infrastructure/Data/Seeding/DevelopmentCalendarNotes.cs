using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;

namespace Gmf.Marush.Care.Infrastructure.Data.Seeding;

/// <summary>One note of each <see cref="CalendarNoteType"/> in the week the database is seeded in.</summary>
public static class DevelopmentCalendarNotes
{
    public static IReadOnlyCollection<CalendarNoteDto> In(DateOnly monday) =>
    [
        Create(monday, CalendarNoteType.Weekly, "Poručiti nove maske i PRX ampule."),
        Create(monday.AddDays(1), CalendarNoteType.Daily, "Javiti se Mariji oko pomeranja termina."),
        Create(monday.AddDays(12), CalendarNoteType.NonWorkingDay, "Edukacija - salon zatvoren.")
    ];

    private static CalendarNoteDto Create(DateOnly date, CalendarNoteType type, string content) => new()
    {
        Id = Guid.NewGuid(),
        Date = date,
        NoteType = type.Value,
        Content = content
    };
}
