using Gmf.DDD.Common.Concepts;

namespace Gmf.Marush.Care.Domain.Models;
public class CalendarEntry(Guid id, DateOnly date, TimeOnly startTime, TimeOnly endTime,
    string? clientName, string? clientPhone, string? clientEmail, Guid? customerId,
    string? notes, decimal? money) : Entity<Guid>(id)
{
    public DateOnly Date { get; } = date;
    public TimeOnly StartTime { get; } = startTime;
    public TimeOnly EndTime { get; } = endTime;
    public string? ClientName { get; } = clientName;
    public string? ClientPhone { get; } = clientPhone;
    public string? ClientEmail { get; } = clientEmail;
    public Guid? CustomerId { get; } = customerId;
    public string? Notes { get; } = notes;
    public decimal? Money { get; } = money;
}
