namespace Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;

public class AppointmentTreatmentDto
{
    public string Name { get; set; } = string.Empty;
    public Guid AppointmentId { get; set; }
    public virtual AppointmentDto Appointment { get; set; } = new AppointmentDto();
}
