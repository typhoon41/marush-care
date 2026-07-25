using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Configurations.Calendar;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

public class CalendarRepository(DbContext context) : ICalendarRepository
{
    private readonly DbSet<CalendarEntryDto> _entries = context.Set<CalendarEntryDto>();
    private readonly DbSet<CalendarNoteDto> _notes = context.Set<CalendarNoteDto>();

    public async Task<IEnumerable<CalendarEntry>> GetEntriesForWeek(DateOnly weekStart)
    {
        var (weekStartDto, weekEndDto) = WeekRange(weekStart);
        var dtos = await _entries
            .Include(entry => entry.Appointment)
            .Include(entry => entry.Treatments)
            .Where(entry => entry.Appointment.ScheduledFor >= weekStartDto && entry.Appointment.ScheduledFor <= weekEndDto)
            .OrderBy(entry => entry.Appointment.ScheduledFor)
            .ToListAsync();
        return dtos.Select(entry => entry.ToDomain());
    }

    public async Task<CalendarEntry?> GetEntryById(Guid id)
    {
        var dto = await _entries
            .Include(entry => entry.Appointment)
            .Include(entry => entry.Treatments)
            .SingleOrDefaultAsync(entry => entry.Id == id);
        return dto?.ToDomain();
    }

    public async Task AddEntry(CalendarEntry entry)
    {
        var appointmentId = entry.AppointmentId ?? await CreateAppointment(entry);
        var dto = new CalendarEntryDto
        {
            AppointmentId = appointmentId,
            Notes = entry.Notes,
            Money = entry.Money
        };
        foreach (var name in entry.Treatments)
        {
            dto.Treatments.Add(new CalendarEntryTreatmentDto { Name = name, CalendarEntry = dto });
        }
        _ = await _entries.AddAsync(dto);
    }

    public async Task UpdateEntry(Guid id, CalendarEntry entry)
    {
        var dto = await _entries
            .Include(entry => entry.Appointment)
            .Include(entry => entry.Treatments)
            .SingleOrDefaultAsync(entry => entry.Id == id)
            ?? throw new InvalidOperationException($"Calendar entry {id} not found.");

        dto.Appointment.ScheduledFor = new DateTimeOffset(entry.Date.ToDateTime(entry.StartTime), TimeSpan.Zero);
        dto.Appointment.ExpectedEndTime = new DateTimeOffset(entry.Date.ToDateTime(entry.EndTime), TimeSpan.Zero);
        dto.Notes = entry.Notes;
        dto.Money = entry.Money;
        UpdateTreatments(dto, entry);
    }

    private static void UpdateTreatments(CalendarEntryDto dto, CalendarEntry entry)
    {
        var removed = dto.Treatments.Where(existing => !entry.Treatments.Contains(existing.Name)).ToList();
        foreach (var treatment in removed)
        {
            _ = dto.Treatments.Remove(treatment);
        }

        var existingNames = dto.Treatments.Select(existing => existing.Name).ToHashSet();
        foreach (var name in entry.Treatments.Where(name => !existingNames.Contains(name)))
        {
            dto.Treatments.Add(new CalendarEntryTreatmentDto { CalendarEntryId = dto.Id, CalendarEntry = dto, Name = name });
        }
    }

    public async Task<bool> DeleteEntry(Guid id)
    {
        var dto = await _entries.FindAsync(id);
        if (dto is null) {
            return false;
        }
        _ = _entries.Remove(dto);
        return true;
    }

    public async Task UpsertNote(CalendarNote note)
    {
        var existing = await _notes
            .SingleOrDefaultAsync(noteDto => noteDto.Date == note.Date && noteDto.NoteType == note.Type.Value);
        if (existing is null)
        {
            _ = await _notes.AddAsync(CalendarNoteDto.FromDomain(note));
        }
        else
        {
            existing.Content = note.Content;
        }
    }

    public async Task<bool> DeleteNote(Guid id)
    {
        var dto = await _notes.FindAsync(id);
        if (dto is null) {
            return false;
        }
        _ = _notes.Remove(dto);
        return true;
    }

    public async Task<IEnumerable<CalendarNote>> GetNotesForWeek(DateOnly weekStart)
    {
        var weekEnd = weekStart.AddDays(CalendarEntryConfiguration.WorkingDaysInWeek - 1);
        var dtos = await _notes
            .Where(note => note.Date >= weekStart && note.Date <= weekEnd ||
                           note.Date == weekStart && note.NoteType == CalendarNoteType.Weekly.Value)
            .ToListAsync();
        return dtos.Select(note => note.ToDomain());
    }

    public async Task<IEnumerable<CalendarAppointment>> GetPublicAppointmentsForWeek(DateOnly weekStart)
    {
        var (weekStartDto, weekEndDto) = WeekRange(weekStart);
        var rejectedId = AppointmentStatus.Rejected.Value;

        var dtos = await context.Set<AppointmentDto>()
            .Include(appointment => appointment.Customer)
            .Include(appointment => appointment.Status)
            .Where(appointment => appointment.ScheduledFor >= weekStartDto && appointment.ScheduledFor <= weekEndDto
                                  && appointment.Status.Id != rejectedId)
            .OrderBy(appointment => appointment.ScheduledFor)
            .ToListAsync();

        return dtos.Select(appointment => new CalendarAppointment(
            appointment.Id,
            DateOnly.FromDateTime(appointment.ScheduledFor.DateTime),
            TimeOnly.FromDateTime(appointment.ScheduledFor.DateTime),
            appointment.ExpectedEndTime.HasValue ? TimeOnly.FromDateTime(appointment.ExpectedEndTime.Value.DateTime) : TimeOnly.FromDateTime(appointment.ScheduledFor.DateTime).AddHours(1),
            $"{appointment.Customer.Name} {appointment.Customer.Surname}".Trim(),
            appointment.Phone,
            appointment.Email ?? string.Empty,
            appointment.Status.Name,
            appointment.Description));
    }

    public async Task<(string Email, string Language)?> GetAppointmentContact(Guid appointmentId)
    {
        var result = await context.Set<AppointmentDto>()
            .Where(appointment => appointment.Id == appointmentId)
            .Select(appointment => new { appointment.Email, appointment.Language })
            .SingleOrDefaultAsync();
        return string.IsNullOrWhiteSpace(result?.Email) ? null : (result!.Email!, result.Language ?? "sr");
    }

    private async Task<Guid> CreateAppointment(CalendarEntry entry)
    {
        var customer = await context.Set<CustomerDto>()
            .Include(customerDto => customerDto.Phones)
            .Include(customerDto => customerDto.Emails)
            .SingleOrDefaultAsync(customerDto => customerDto.Id == entry.CustomerId)
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
        new DateTimeOffset(weekStart.AddDays(CalendarEntryConfiguration.WorkingDaysInWeek - 1).ToDateTime(TimeOnly.MaxValue), TimeSpan.Zero));
}
