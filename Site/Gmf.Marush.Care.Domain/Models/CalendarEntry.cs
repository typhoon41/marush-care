using Gmf.DDD.Common.Concepts;

namespace Gmf.Marush.Care.Domain.Models;
public class CalendarEntry(Guid id, Guid? appointmentId, Guid customerId,
    DateOnly date, TimeOnly startTime, TimeOnly endTime,
    string? notes, decimal? money, IReadOnlyCollection<string> treatments, string clientName,
    bool bookedOnline = false) : Entity<Guid>(id)
{
    public Guid? AppointmentId { get; } = appointmentId;
    public Guid CustomerId { get; } = customerId;
    public DateOnly Date { get; } = date;
    public TimeOnly StartTime { get; } = startTime;
    public TimeOnly EndTime { get; } = endTime;
    public string? Notes { get; } = notes;
    public decimal? Money { get; } = money;
    public IReadOnlyCollection<string> Treatments { get; } = treatments;
    public string ClientName { get; } = clientName;

    /// <summary>The entry started as a request made on the public site; it is read from storage, never sent by a client.</summary>
    public bool BookedOnline { get; } = bookedOnline;

    public CalendarPeriod Period => new(Date, StartTime, EndTime);
}
