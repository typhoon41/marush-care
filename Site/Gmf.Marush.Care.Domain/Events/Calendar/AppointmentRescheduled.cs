using Gmf.DDD.Common.Contracts;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Events.Calendar;

public class AppointmentRescheduled(string email, string language, CalendarPeriod previous, CalendarPeriod current) : IDomainEvent
{
    public string Name => nameof(AppointmentRescheduled);
    public dynamic Data => null!;

    public string Email { get; } = email;
    public string Language { get; } = language;
    public CalendarPeriod Previous { get; } = previous;
    public CalendarPeriod Current { get; } = current;
}
