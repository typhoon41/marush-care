using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Api.Models.Calendar;
public record NewCalendarNoteDto
{
    public DateOnly Date { get; init; }
    public string NoteType { get; init; } = "Daily";
    public string Content { get; init; } = string.Empty;

    public CalendarNote ToDomain() => new(Guid.Empty, Date, CalendarNoteType.From(NoteType), Content);
}
