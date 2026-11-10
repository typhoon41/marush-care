using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Api.Models.Calendar;
public record CalendarNoteDto(Guid Id, DateOnly Date, string NoteType, string Content)
{
    public static CalendarNoteDto MapFrom(CalendarNote note) => new(note.Id, note.Date, note.Type.DisplayName, note.Content);
}
