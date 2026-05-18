using Gmf.DDD.Common.Concepts;
using Gmf.Marush.Care.Domain.Enumerations;

namespace Gmf.Marush.Care.Domain.Models;
public class CalendarNote(Guid id, DateOnly date, CalendarNoteType type, string content) : Entity<Guid>(id)
{
    public DateOnly Date { get; } = date;
    public CalendarNoteType Type { get; } = type;
    public string Content { get; } = content;
}
