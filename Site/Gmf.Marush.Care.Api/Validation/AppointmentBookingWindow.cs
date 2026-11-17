namespace Gmf.Marush.Care.Api.Validation;

/// <summary>
/// The calendar days a customer may book, matching the customer date picker:
/// weekdays from today up to the same day next month. The server runs in the salon's (Belgrade) time zone.
/// </summary>
public sealed class AppointmentBookingWindow
{
    private readonly DateOnly _firstDay;
    private readonly DateOnly _lastDay;

    public AppointmentBookingWindow(DateOnly today)
    {
        _firstDay = today;
        _lastDay = today.AddMonths(1);
    }

    public bool Contains(DateOnly date) =>
        date >= _firstDay && date <= _lastDay && date.DayOfWeek is not (DayOfWeek.Saturday or DayOfWeek.Sunday);
}
