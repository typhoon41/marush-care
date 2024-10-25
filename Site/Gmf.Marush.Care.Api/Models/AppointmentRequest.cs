using Gmf.DDD.Common.Abstractions;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Api.Models;

public record AppointmentRequest
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateOnly Date { get; set; }
    public TimeOnly Time { get; set; }
    public int Duration { get; set; }

    internal Customer Customer => new(Guid.Empty, Name, Surname, Email, Phone);

    internal Period Period()
    {
        // A request must always come from Belgrade time zone.
        var date = new DateTimeOffset(Date, Time, TimeSpan.FromHours(2));
        return new Period(date, date.AddMinutes(Duration));
    }
}
