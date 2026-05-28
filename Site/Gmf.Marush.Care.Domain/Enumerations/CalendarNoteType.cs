using Gmf.DDD.Common.Concepts;

namespace Gmf.Marush.Care.Domain.Enumerations;
public class CalendarNoteType(int value, string displayName) : Enumeration<int>(value, displayName)
{
    public static CalendarNoteType Daily { get; } = new(1, nameof(Daily));
    public static CalendarNoteType Weekly { get; } = new(2, nameof(Weekly));

    public static CalendarNoteType From(string name) => name == Weekly.DisplayName ? Weekly : Daily;
    public static CalendarNoteType From(int value) => value == Weekly.Value ? Weekly : Daily;
}
