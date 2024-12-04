using System.Globalization;
using Gmf.DDD.Common.Abstractions;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Api.Models;

public record AppointmentRequest
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public IEnumerable<string> Treatments { get; set; } = [];
    public IEnumerable<string> SerbianTreatments { get; set; } = [];
    public int Sum { get; set; }
    public DateOnly Date { get; set; }
    public TimeOnly Time { get; set; }
    public int Duration { get; set; }

    internal Customer Customer => new(Guid.Empty, Name, Surname, Email, Phone);
    internal string FullName => $"{Name} {Surname}";
    internal string FormattedAppointmentStart => LocalTime.ToString("g", CultureInfo.CurrentCulture);
    internal string SerbianAppointmentStart => LocalTime.ToString("g", new CultureInfo("sr"));
    private DateTimeOffset LocalTime => Period().StartDate.ToLocalTime();

    internal Period Period()
    {
        // A request must always come from Belgrade time zone.
        var dateTime = Date.ToDateTime(Time, DateTimeKind.Local);
        return new Period(dateTime, dateTime.AddMinutes(Duration));
    }
}
