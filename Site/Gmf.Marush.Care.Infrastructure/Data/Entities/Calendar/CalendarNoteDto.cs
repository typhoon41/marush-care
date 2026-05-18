using Gmf.DDD.Common.Persistance;
using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
public record CalendarNoteDto : EntityDto
{
    public DateOnly Date { get; set; }
    public int NoteType { get; set; }
    public string Content { get; set; } = string.Empty;

    public CalendarNote ToDomain()
    {
        var type = NoteType == CalendarNoteType.Weekly.Value ? CalendarNoteType.Weekly : CalendarNoteType.Daily;
        return new CalendarNote(Id, Date, type, Content);
    }

    public static CalendarNoteDto FromDomain(CalendarNote note) => new()
    {
        Date = note.Date,
        NoteType = note.Type.Value,
        Content = note.Content
    };
}
