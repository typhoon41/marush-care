namespace Gmf.Marush.Care.Api.Models.Calendar;
public record NewCalendarNoteDto
{
    public DateOnly Date { get; init; }
    public string NoteType { get; init; } = "Daily";
    public string Content { get; init; } = string.Empty;
}
