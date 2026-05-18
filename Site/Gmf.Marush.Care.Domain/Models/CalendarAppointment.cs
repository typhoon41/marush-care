namespace Gmf.Marush.Care.Domain.Models;
public record CalendarAppointment(Guid Id, DateOnly Date, TimeOnly StartTime, TimeOnly EndTime,
    string ClientName, string Phone, string Email, string Status, string? Description);
