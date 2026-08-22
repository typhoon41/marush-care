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

    public async Task<IEnumerable<CalendarEntry>> GetEntriesForWeek(DateOnly weekStart)
    {
        var week = CalendarWeekRange.For(weekStart);
        var dtos = await _entries
            .Include(entry => entry.Appointment.Customer)
            .Include(entry => entry.Treatments)
            .Where(entry => entry.Appointment.ScheduledFor >= week.Start && entry.Appointment.ScheduledFor <= week.End)
            .OrderBy(entry => entry.Appointment.ScheduledFor)
            .ToListAsync();
        return dtos.Select(entry => entry.ToDomain());
    }

    public async Task<CalendarEntry?> GetEntryById(Guid id)
    {
        var dto = await _entries
            .Include(entry => entry.Appointment.Customer)
            .Include(entry => entry.Treatments)
            .SingleOrDefaultAsync(entry => entry.Id == id);
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
                                  && !context.Set<CalendarEntryDto>().Any(entry => entry.AppointmentId == appointment.Id))
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
