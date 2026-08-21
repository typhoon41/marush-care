using Gmf.DDD.Common.Concepts;

namespace Gmf.Marush.Care.Domain.Enumerations;
public class CalendarNoteType(int value, string displayName) : Enumeration<int>(value, displayName)
{
    public static CalendarNoteType Daily { get; } = new(1, nameof(Daily));
    public static CalendarNoteType Weekly { get; } = new(2, nameof(Weekly));
    public static CalendarNoteType NonWorkingDay { get; } = new(3, nameof(NonWorkingDay));

    public static CalendarNoteType From(string name) => name switch
    {
        nameof(Weekly) => Weekly,
        nameof(NonWorkingDay) => NonWorkingDay,
        _ => Daily
    };

    public static CalendarNoteType From(int value) => value switch
    {
        2 => Weekly,
        3 => NonWorkingDay,
        _ => Daily
    };
}
