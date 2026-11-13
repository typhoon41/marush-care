using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

public class CalendarRetrievalRepository(DbContext context) : ICalendarRetrievalRepository
{
    private static readonly Guid[] StatusesVisibleInCalendar =
        [AppointmentStatus.Requested.Value, AppointmentStatus.Approved.Value];

    private readonly DbSet<CalendarEntryDto> _entries = context.Set<CalendarEntryDto>();
    private readonly DbSet<CalendarNoteDto> _notes = context.Set<CalendarNoteDto>();

    private IQueryable<CalendarEntryDto> EntriesWithDetails => _entries
        .Include(entry => entry.Appointment.Customer)
        .Include(entry => entry.Treatments);

    public async Task<IEnumerable<CalendarEntry>> GetEntriesForWeek(DateOnly weekStart)
    {
        var week = CalendarWeekRange.For(weekStart);
        var dtos = await EntriesWithDetails
            .Where(entry => entry.Appointment.ScheduledFor >= week.Start && entry.Appointment.ScheduledFor <= week.End)
            .OrderBy(entry => entry.Appointment.ScheduledFor)
            .ToListAsync();
        return dtos.Select(entry => entry.ToDomain());
    }

    // Occupied by anything the calendar draws: an entry, or an online request that has no entry yet.
    // Back-to-back periods do not count, and neither does the appointment the caller is saving.
    // An entry and a request store their times differently (see CalendarSchedule), so each is compared
    // against the period expressed its own way.
    public async Task<bool> IsOccupied(CalendarPeriod period, Guid? ownAppointmentId)
    {
        var start = CalendarSchedule.At(period.Date, period.StartTime);
        var end = CalendarSchedule.At(period.Date, period.EndTime);
        var requestedStart = CalendarSchedule.RequestedAt(period.Date, period.StartTime);
        var requestedEnd = CalendarSchedule.RequestedAt(period.Date, period.EndTime);
        var defaultHours = CalendarSchedule.DefaultDuration.TotalHours;
        return await context.Set<AppointmentDto>()
            .AsNoTracking()
            .Where(appointment => appointment.Id != ownAppointmentId)
            .Select(appointment => new
            {
                appointment.ScheduledFor,
                End = appointment.ExpectedEndTime ?? appointment.ScheduledFor.AddHours(defaultHours),
                HasEntry = _entries.Any(entry => entry.AppointmentId == appointment.Id),
                IsVisibleRequest = StatusesVisibleInCalendar.Contains(appointment.Status.Id)
            })
            .AnyAsync(slot => (slot.HasEntry && slot.ScheduledFor < end && slot.End > start)
                              || (!slot.HasEntry && slot.IsVisibleRequest
                                  && slot.ScheduledFor < requestedEnd && slot.End > requestedStart));
    }

    public async Task<CalendarEntry?> GetEntryById(Guid id)
    {
        var dto = await EntriesWithDetails.SingleOrDefaultAsync(entry => entry.Id == id);
        return dto?.ToDomain();
    }

    public async Task<IEnumerable<CalendarNote>> GetNotesForWeek(DateOnly weekStart)
    {
        var week = CalendarWeekRange.For(weekStart);
        var dtos = await _notes
            .Where(note => note.Date >= week.FirstDay && note.Date <= week.LastDay)
            .ToListAsync();
        return dtos.Select(note => note.ToDomain());
    }

    public async Task<IEnumerable<CalendarAppointment>> GetPublicAppointmentsForWeek(DateOnly weekStart)
    {
        var week = CalendarWeekRange.For(weekStart);
        var dtos = await context.Set<AppointmentDto>()
            .Include(appointment => appointment.Customer)
            .Include(appointment => appointment.Status)
            .Where(appointment => appointment.ScheduledFor >= week.Start && appointment.ScheduledFor <= week.End
                                  && StatusesVisibleInCalendar.Contains(appointment.Status.Id)
                                  && !_entries.Any(entry => entry.AppointmentId == appointment.Id))
            .OrderBy(appointment => appointment.ScheduledFor)
            .ToListAsync();

        return dtos.Select(appointment => appointment.MapToCalendarAppointment());
    }

    public async Task<(string Email, string Language)?> GetAppointmentContact(Guid appointmentId)
    {
        var result = await context.Set<AppointmentDto>()
            .Where(appointment => appointment.Id == appointmentId)
            .Select(appointment => new { appointment.Email, appointment.Language })
            .SingleOrDefaultAsync();
        return string.IsNullOrWhiteSpace(result?.Email) ? null : (result!.Email!, result.Language ?? "sr");
    }
}
