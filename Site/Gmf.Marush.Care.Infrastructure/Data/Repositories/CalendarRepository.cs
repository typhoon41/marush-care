using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

public class CalendarRepository(DbContext context) : ICalendarRepository
{
    private readonly DbSet<CalendarEntryDto> _entries = context.Set<CalendarEntryDto>();
    private readonly DbSet<CalendarNoteDto> _notes = context.Set<CalendarNoteDto>();

    public async Task<IEnumerable<CalendarEntry>> GetEntriesForWeekAsync(DateOnly weekStart)
    {
        var weekEnd = weekStart.AddDays(6);
        var dtos = await _entries
            .Where(e => e.Date >= weekStart && e.Date <= weekEnd)
            .OrderBy(e => e.Date)
            .ThenBy(e => e.StartTime)
            .ToListAsync();
        return dtos.Select(d => d.ToDomain());
    }

    public async Task<CalendarEntry?> GetEntryByIdAsync(Guid id)
    {
        var dto = await _entries.FindAsync(id);
        return dto?.ToDomain();
    }

    public async Task AddEntryAsync(CalendarEntry entry)
    {
        var dto = CalendarEntryDto.FromDomain(entry);
        _ = await _entries.AddAsync(dto);
    }

    public async Task UpdateEntryAsync(Guid id, CalendarEntry entry)
    {
        var dto = await _entries.FindAsync(id)
            ?? throw new InvalidOperationException($"Calendar entry {id} not found.");
        dto.Date = entry.Date;
        dto.StartTime = entry.StartTime;
        dto.EndTime = entry.EndTime;
        dto.ClientName = entry.ClientName;
        dto.ClientPhone = entry.ClientPhone;
        dto.ClientEmail = entry.ClientEmail;
        dto.CustomerId = entry.CustomerId;
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
        var weekStartDto = new DateTimeOffset(weekStart.ToDateTime(TimeOnly.MinValue), TimeSpan.Zero);
        var weekEndDto = new DateTimeOffset(weekStart.AddDays(6).ToDateTime(TimeOnly.MaxValue), TimeSpan.Zero);
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
}
