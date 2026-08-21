namespace Gmf.Marush.Care.Api.Models.Calendar;
public record CalendarNoteDto(Guid Id, DateOnly Date, string NoteType, string Content);
