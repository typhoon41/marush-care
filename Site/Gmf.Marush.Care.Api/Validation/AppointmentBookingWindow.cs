namespace Gmf.Marush.Care.Api.Validation;

/// <summary>
/// The range of calendar days a customer may book: from today up to <see cref="DaysAhead"/> days ahead,
/// where "today" is the salon's day in Belgrade, independent of the server's time zone.
/// </summary>
public sealed class AppointmentBookingWindow
{
    private const int DaysAhead = 32;
    private static readonly TimeZoneInfo SalonTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Europe/Belgrade");

    private readonly DateOnly _firstDay;
    private readonly DateOnly _lastDay;

    public AppointmentBookingWindow(DateTimeOffset now)
    {
        _firstDay = DateOnly.FromDateTime(TimeZoneInfo.ConvertTime(now, SalonTimeZone).DateTime);
        _lastDay = _firstDay.AddDays(DaysAhead);
    }

    public bool Contains(DateOnly date) => date >= _firstDay && date <= _lastDay;
}
