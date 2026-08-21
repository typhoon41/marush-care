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
    string? Description);
