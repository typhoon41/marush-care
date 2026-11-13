using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;

namespace Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;

/// <summary>How the calendar's times are stored on an appointment record.</summary>
public static class CalendarSchedule
{
    public static readonly TimeSpan DefaultDuration = TimeSpan.FromHours(1);

    /// <summary>A calendar entry stores the wall-clock time it shows, tagged with a zero offset.</summary>
    public static DateTimeOffset At(DateOnly date, TimeOnly time) => new(date.ToDateTime(time), TimeSpan.Zero);

    /// <summary>
    /// An online request stores the instant its wall-clock time has in the server's time zone,
    /// which is how the public booking endpoint builds it.
    /// </summary>
    public static DateTimeOffset RequestedAt(DateOnly date, TimeOnly time) =>
        new(date.ToDateTime(time, DateTimeKind.Local));

    public static DateTimeOffset EndOf(AppointmentDto appointment) =>
        appointment.ExpectedEndTime ?? appointment.ScheduledFor.Add(DefaultDuration);
}
