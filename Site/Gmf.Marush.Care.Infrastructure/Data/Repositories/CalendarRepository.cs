using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

public class CalendarRepository(DbContext context) : ICalendarRepository
{
    private readonly DbSet<CalendarEntryDto> _entries = context.Set<CalendarEntryDto>();
    private readonly DbSet<CalendarNoteDto> _notes = context.Set<CalendarNoteDto>();

    public async Task<IEnumerable<CalendarEntry>> GetEntriesForWeekAsync(DateOnly weekStart)
    {
        var (weekStartDto, weekEndDto) = WeekRange(weekStart);
        var dtos = await _entries
            .Include(e => e.Appointment)
            .Where(e => e.Appointment.ScheduledFor >= weekStartDto && e.Appointment.ScheduledFor <= weekEndDto)
            .OrderBy(e => e.Appointment.ScheduledFor)
            .ToListAsync();
        return dtos.Select(d => d.ToDomain());
    }

    public async Task<CalendarEntry?> GetEntryByIdAsync(Guid id)
    {
        var dto = await _entries
            .Include(e => e.Appointment)
            .SingleOrDefaultAsync(e => e.Id == id);
        return dto?.ToDomain();
    }

    public async Task AddEntryAsync(CalendarEntry entry)
    {
        var appointmentId = entry.AppointmentId ?? await CreateAppointmentAsync(entry);
        _ = await _entries.AddAsync(new CalendarEntryDto
        {
            AppointmentId = appointmentId,
            Notes = entry.Notes,
            Money = entry.Money
        });
    }

    public async Task UpdateEntryAsync(Guid id, CalendarEntry entry)
    {
        var dto = await _entries
            .Include(e => e.Appointment)
            .SingleOrDefaultAsync(e => e.Id == id)
            ?? throw new InvalidOperationException($"Calendar entry {id} not found.");

        dto.Appointment.ScheduledFor = new DateTimeOffset(entry.Date.ToDateTime(entry.StartTime), TimeSpan.Zero);
        dto.Appointment.ExpectedEndTime = new DateTimeOffset(entry.Date.ToDateTime(entry.EndTime), TimeSpan.Zero);
        dto.Notes = entry.Notes;
        dto.Money = entry.Money;
    }

    public async Task<bool> DeleteEntryAsync(Guid id)
    {
        var dto = await _entries.FindAsync(id);
        if (dto is null) return false;
        _ = _entries.Remove(dto);
        return true;
    }

    public async Task UpsertNoteAsync(CalendarNote note)
    {
        var existing = await _notes
            .SingleOrDefaultAsync(n => n.Date == note.Date && n.NoteType == note.Type.Value);
        if (existing is null)
        {
            _ = await _notes.AddAsync(CalendarNoteDto.FromDomain(note));
        }
        else
        {
            existing.Content = note.Content;
        }
    }

    public async Task<bool> DeleteNoteAsync(Guid id)
    {
        var dto = await _notes.FindAsync(id);
        if (dto is null) return false;
        _ = _notes.Remove(dto);
        return true;
    }

    public async Task<IEnumerable<CalendarNote>> GetNotesForWeekAsync(DateOnly weekStart)
    {
        var weekEnd = weekStart.AddDays(6);
        var dtos = await _notes
            .Where(n => n.Date >= weekStart && n.Date <= weekEnd ||
                        n.Date == weekStart && n.NoteType == CalendarNoteType.Weekly.Value)
            .ToListAsync();
        return dtos.Select(d => d.ToDomain());
    }

    public async Task<IEnumerable<CalendarAppointment>> GetPublicAppointmentsForWeekAsync(DateOnly weekStart)
    {
        var (weekStartDto, weekEndDto) = WeekRange(weekStart);
        var rejectedId = AppointmentStatus.Rejected.Value;

        var dtos = await context.Set<AppointmentDto>()
            .Include(a => a.Customer)
            .Include(a => a.Status)
            .Where(a => a.ScheduledFor >= weekStartDto && a.ScheduledFor <= weekEndDto
                        && a.Status.Id != rejectedId)
            .OrderBy(a => a.ScheduledFor)
            .ToListAsync();

        return dtos.Select(a => new CalendarAppointment(
            a.Id,
            DateOnly.FromDateTime(a.ScheduledFor.DateTime),
            TimeOnly.FromDateTime(a.ScheduledFor.DateTime),
            a.ExpectedEndTime.HasValue ? TimeOnly.FromDateTime(a.ExpectedEndTime.Value.DateTime) : TimeOnly.FromDateTime(a.ScheduledFor.DateTime).AddHours(1),
            $"{a.Customer.Name} {a.Customer.Surname}".Trim(),
            a.Phone,
            a.Email ?? string.Empty,
            a.Status.Name,
            a.Description));
    }

    public async Task<string?> GetAppointmentEmailAsync(Guid appointmentId) =>
        await context.Set<AppointmentDto>()
            .Where(a => a.Id == appointmentId)
            .Select(a => a.Email)
            .SingleOrDefaultAsync();

    private async Task<Guid> CreateAppointmentAsync(CalendarEntry entry)
    {
        var customer = await context.Set<CustomerDto>()
            .Include(c => c.Phones)
            .Include(c => c.Emails)
            .SingleOrDefaultAsync(c => c.Id == entry.CustomerId)
            ?? throw new InvalidOperationException("Customer not found.");

        var phone = customer.Phones.First();
        var email = customer.Emails.FirstOrDefault();
        var approvedStatus = await context.Set<AppointmentStatusDto>().FindAsync(AppointmentStatus.Approved.Value)
            ?? throw new InvalidOperationException("Appointment status not found.");

        var appointment = new AppointmentDto
        {
            CustomerId = customer.Id,
            Customer = customer,
            ScheduledFor = new DateTimeOffset(entry.Date.ToDateTime(entry.StartTime), TimeSpan.Zero),
            ExpectedEndTime = new DateTimeOffset(entry.Date.ToDateTime(entry.EndTime), TimeSpan.Zero),
            Phone = phone.PhoneNumber ?? string.Empty,
            Email = email?.Email,
            Language = "sr",
            Description = string.Empty,
            Status = approvedStatus,
            CustomerPhone = phone,
            CustomerEmail = email
        };
        _ = await context.Set<AppointmentDto>().AddAsync(appointment);
        return appointment.Id;
    }

    private static (DateTimeOffset start, DateTimeOffset end) WeekRange(DateOnly weekStart) => (
        new DateTimeOffset(weekStart.ToDateTime(TimeOnly.MinValue), TimeSpan.Zero),
        new DateTimeOffset(weekStart.AddDays(6).ToDateTime(TimeOnly.MaxValue), TimeSpan.Zero));
}
