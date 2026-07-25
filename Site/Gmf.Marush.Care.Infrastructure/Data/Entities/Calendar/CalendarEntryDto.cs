using Gmf.DDD.Common.Persistance;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;

namespace Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
public record CalendarEntryDto : EntityDto
{
    public Guid AppointmentId { get; set; }
    public AppointmentDto Appointment { get; set; } = new();
    public string? Notes { get; set; }
    public decimal? Money { get; set; }
    public IList<CalendarEntryTreatmentDto> Treatments { get; } = [];

    public CalendarEntry ToDomain() => new(
        Id,
        AppointmentId,
        Appointment.CustomerId,
        DateOnly.FromDateTime(Appointment.ScheduledFor.DateTime),
        TimeOnly.FromDateTime(Appointment.ScheduledFor.DateTime),
        Appointment.ExpectedEndTime.HasValue
            ? TimeOnly.FromDateTime(Appointment.ExpectedEndTime.Value.DateTime)
            : TimeOnly.FromDateTime(Appointment.ScheduledFor.DateTime).AddHours(1),
        Notes,
        Money,
        [.. Treatments.Select(treatment => treatment.Name)]);
}
