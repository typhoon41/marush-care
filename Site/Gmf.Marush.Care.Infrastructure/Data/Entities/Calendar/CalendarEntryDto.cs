using Gmf.DDD.Common.Persistance;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;

namespace Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
public record CalendarEntryDto : EntityDto
{
    public Guid AppointmentId { get; set; }
    public AppointmentDto Appointment { get; set; } = new();
    public decimal? Money { get; set; }
    public IList<CalendarEntryTreatmentDto> Treatments { get; } = [];

    // Keeps the treatments that are still named, so their rows are not deleted and inserted again.
    public void ReplaceTreatments(IReadOnlyCollection<string> names)
    {
        foreach (var removed in Treatments.Where(existing => !names.Contains(existing.Name)).ToList())
        {
            _ = Treatments.Remove(removed);
        }

        var kept = Treatments.Select(existing => existing.Name).ToHashSet();
        foreach (var name in names.Where(name => !kept.Contains(name)))
        {
            Treatments.Add(new CalendarEntryTreatmentDto { CalendarEntryId = Id, CalendarEntry = this, Name = name });
        }
    }

    public CalendarEntry ToDomain() => new(
        Id,
        AppointmentId,
        Appointment.CustomerId,
        DateOnly.FromDateTime(Appointment.ScheduledFor.DateTime),
        TimeOnly.FromDateTime(Appointment.ScheduledFor.DateTime),
        TimeOnly.FromDateTime(CalendarSchedule.EndOf(Appointment).DateTime),
        string.IsNullOrWhiteSpace(Appointment.Description) ? null : Appointment.Description,
        Money,
        [.. Treatments.Select(treatment => treatment.Name)],
        $"{Appointment.Customer.Name} {Appointment.Customer.Surname}".Trim());
}
