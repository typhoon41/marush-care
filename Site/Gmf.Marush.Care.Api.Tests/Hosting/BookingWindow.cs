namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>
/// Dates relative to the server clock, so the booking-window tests never rot. The validator reads DateTime.Now
/// (AppointmentRequestValidator), so these dates read it too: the tests share the server's process and clock.
/// </summary>
public static class BookingWindow
{
    public static DateOnly Today => DateOnly.FromDateTime(DateTime.Now);

    public static DateOnly LastDay => Today.AddMonths(1);

    /// <summary>The n-th Monday-to-Friday day after today (n = 1 is the first one); always inside the window for n ≤ 15.</summary>
    public static DateOnly Weekday(int number)
    {
        var date = Today;
        var found = 0;
        while (found < number)
        {
            date = date.AddDays(1);
            if (IsWeekday(date))
            {
                found++;
            }
        }

        return date;
    }

    public static DateOnly Next(DayOfWeek day)
    {
        var date = Today.AddDays(1);
        while (date.DayOfWeek != day)
        {
            date = date.AddDays(1);
        }

        return date;
    }

    public static bool IsWeekday(DateOnly date) => date.DayOfWeek is not (DayOfWeek.Saturday or DayOfWeek.Sunday);
}
