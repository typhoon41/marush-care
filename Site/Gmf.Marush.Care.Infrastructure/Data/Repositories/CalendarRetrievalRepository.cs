using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
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
    public async Task<bool> IsOccupied(CalendarPeriod period, Guid? ownAppointmentId)
    {
        var start = new DateTimeOffset(period.Date.ToDateTime(period.StartTime), TimeSpan.Zero);
        var end = new DateTimeOffset(period.Date.ToDateTime(period.EndTime), TimeSpan.Zero);
        return await context.Set<AppointmentDto>()
            .AsNoTracking()
            .Where(appointment => appointment.Id != ownAppointmentId && appointment.ScheduledFor < end
                                  && (appointment.ExpectedEndTime ?? appointment.ScheduledFor.AddHours(1)) > start)
            .AnyAsync(appointment => _entries.Any(entry => entry.AppointmentId == appointment.Id)
                                     || StatusesVisibleInCalendar.Contains(appointment.Status.Id));
    }

    public async Task<bool> AppointmentExists(Guid appointmentId) =>
        await context.Set<AppointmentDto>().AnyAsync(appointment => appointment.Id == appointmentId);

    public async Task<bool> CustomerExists(Guid customerId) =>
        await context.Set<CustomerDto>().AnyAsync(customer => customer.Id == customerId);

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

        return dtos.Select(ToDomain);
    }

    public async Task<(string Email, string Language)?> GetAppointmentContact(Guid appointmentId)
    {
        var result = await context.Set<AppointmentDto>()
            .Where(appointment => appointment.Id == appointmentId)
            .Select(appointment => new { appointment.Email, appointment.Language })
            .SingleOrDefaultAsync();
        return string.IsNullOrWhiteSpace(result?.Email) ? null : (result!.Email!, result.Language ?? "sr");
    }

    private static CalendarAppointment ToDomain(AppointmentDto appointment)
    {
        var start = TimeOnly.FromDateTime(appointment.ScheduledFor.DateTime);
        var end = appointment.ExpectedEndTime.HasValue
            ? TimeOnly.FromDateTime(appointment.ExpectedEndTime.Value.DateTime)
            : start.AddHours(1);

        return new CalendarAppointment(
            appointment.Id,
            DateOnly.FromDateTime(appointment.ScheduledFor.DateTime),
            start,
            end,
            $"{appointment.Customer.Name} {appointment.Customer.Surname}".Trim(),
            appointment.Phone,
            appointment.Email ?? string.Empty,
            appointment.Status.Name,
            appointment.Description);
    }
}
