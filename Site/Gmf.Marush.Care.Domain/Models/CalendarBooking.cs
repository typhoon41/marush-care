using Gmf.Marush.Care.Domain.Events.Calendar;
using Gmf.Marush.Care.Domain.Exceptions;

namespace Gmf.Marush.Care.Domain.Models;

/// <summary>Placing an entry on the calendar: a new one, or an edit that replaces an existing one.</summary>
public class CalendarBooking(CalendarEntry entry, CalendarEntry? replaced = null)
{
    public CalendarPeriod Period => entry.Period;

    /// <summary>The appointment that may already hold the slot because it is this booking's own.</summary>
    public Guid? HeldAppointmentId => replaced?.AppointmentId ?? entry.AppointmentId;

    /// <summary>
    /// A new entry needs a free slot. An edited one needs it only when it moves, so entries that
    /// already overlap stay editable in every other way.
    /// </summary>
    public bool ClaimsSlot => replaced is null || replaced.Period != entry.Period;

    /// <summary>The appointment whose client is told about a new time, when the edit moved one.</summary>
    public Guid? MovedAppointmentId => replaced is not null && ClaimsSlot ? replaced.AppointmentId : null;

    public void Claim(bool slotOccupied)
    {
        if (ClaimsSlot && slotOccupied)
        {
            throw new CalendarSlotTakenException(Period);
        }
    }

    public AppointmentRescheduled Rescheduled(string email, string language) =>
        new(email, language, (replaced ?? entry).Period, Period);
}
