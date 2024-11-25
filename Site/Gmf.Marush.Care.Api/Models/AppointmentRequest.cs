using Gmf.DDD.Common.Abstractions;
using Gmf.Marush.Care.Domain.Models;
using System.Globalization;

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

    internal string FormattedAppointmentStart => Period().StartDate.ToString("g", CultureInfo.CurrentCulture);

    internal Period Period()
    {
        // A request must always come from Belgrade time zone.
        var date = new DateTimeOffset(Date, Time, TimeSpan.FromHours(2));
        return new Period(date, date.AddMinutes(Duration));
    }
}
