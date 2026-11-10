using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Api.Models.Calendar;
public record PublicAppointmentDto(
    Guid Id,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime,
    string ClientName,
    string Phone,
    string Email,
    string Status,
    string? Description)
{
    public static PublicAppointmentDto MapFrom(CalendarAppointment appointment) => new(appointment.Id,
        appointment.Date, appointment.StartTime, appointment.EndTime, appointment.ClientName,
        appointment.Phone, appointment.Email, appointment.Status, appointment.Description);
}
