namespace Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;

public class CalendarEntryTreatmentDto
{
    public string Name { get; set; } = string.Empty;
    public Guid CalendarEntryId { get; set; }
    public virtual CalendarEntryDto CalendarEntry { get; set; } = new CalendarEntryDto();
}
