using Gmf.DDD.Common.Persistance;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;

namespace Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
public record CalendarEntryDto : EntityDto
{
    public Guid AppointmentId { get; set; }
    public AppointmentDto Appointment { get; set; } = new();

    public CalendarEntry ToDomain() => new(
        Id,
        AppointmentId,
        Appointment.CustomerId,
        DateOnly.FromDateTime(Appointment.ScheduledFor.DateTime),
        TimeOnly.FromDateTime(Appointment.ScheduledFor.DateTime),
        TimeOnly.FromDateTime(Appointment.End().DateTime),
        string.IsNullOrWhiteSpace(Appointment.Description) ? null : Appointment.Description,
        Appointment.Money,
        Appointment.TreatmentNames(),
        $"{Appointment.Customer.Name} {Appointment.Customer.Surname}".Trim());
}
