using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

public class CalendarModificationRepository(DbContext context) : ICalendarModificationRepository
{
    private readonly DbSet<CalendarEntryDto> _entries = context.Set<CalendarEntryDto>();
    private readonly DbSet<CalendarNoteDto> _notes = context.Set<CalendarNoteDto>();
    private readonly CalendarEntryAppointments _appointments = new(context);

    // False when the online request or the customer the entry is for does not exist; nothing is changed then.
    public async Task<bool> AddEntry(CalendarEntry entry)
    {
        var appointment = await _appointments.For(entry);
        if (appointment is null)
        {
            return false;
        }

        appointment.Schedule(entry.Period);
        if (!string.IsNullOrWhiteSpace(entry.Notes))
        {
            appointment.Description = entry.Notes;
        }

        var dto = new CalendarEntryDto
        {
            AppointmentId = appointment.Id,
            Appointment = appointment,
            Money = entry.Money
        };
        dto.ReplaceTreatments(entry.Treatments);

        _ = await _entries.AddAsync(dto);
        return true;
    }

    // False when the entry or its new customer does not exist; nothing is changed then.
    public async Task<bool> UpdateEntry(Guid id, CalendarEntry entry)
    {
        var dto = await _entries
            .Include(existing => existing.Appointment)
            .Include(existing => existing.Treatments)
            .SingleOrDefaultAsync(existing => existing.Id == id);
        if (dto is null || !await _appointments.Reassign(dto.Appointment, entry.CustomerId))
        {
            return false;
        }

        dto.Appointment.Schedule(entry.Period);
        dto.Appointment.Description = entry.Notes ?? string.Empty;
        dto.Money = entry.Money;
        dto.ReplaceTreatments(entry.Treatments);
        return true;
    }

    public async Task<bool> DeleteEntry(Guid id)
    {
        var dto = await _entries
            .Include(entry => entry.Appointment)
            .SingleOrDefaultAsync(entry => entry.Id == id);
        if (dto is null)
        {
            return false;
        }

        _ = _entries.Remove(dto);
        _appointments.Remove(dto.Appointment);
        return true;
    }

    public async Task UpsertNote(CalendarNote note)
    {
        var existing = await _notes
            .SingleOrDefaultAsync(dto => dto.Date == note.Date && dto.NoteType == note.Type.Value);
        if (existing is null)
        {
            _ = await _notes.AddAsync(CalendarNoteDto.FromDomain(note));
            return;
        }

        existing.Content = note.Content;
    }

    public async Task<bool> DeleteNote(Guid id)
    {
        var dto = await _notes.FindAsync(id);
        if (dto is null)
        {
            return false;
        }

        _ = _notes.Remove(dto);
        return true;
    }
}
