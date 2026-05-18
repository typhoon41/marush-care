namespace Gmf.Marush.Care.Api.Models.Calendar;
public record CalendarNoteResponse(Guid Id, DateOnly Date, string NoteType, string Content);
