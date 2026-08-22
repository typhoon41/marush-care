using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

public class CalendarModificationRepository(DbContext context) : ICalendarModificationRepository
{
    private readonly DbSet<CalendarEntryDto> _entries = context.Set<CalendarEntryDto>();
    private readonly DbSet<CalendarNoteDto> _notes = context.Set<CalendarNoteDto>();

    public async Task AddEntry(CalendarEntry entry)
    {
        var appointment = entry.AppointmentId.HasValue
            ? await context.Set<AppointmentDto>().FindAsync(entry.AppointmentId.Value)
                ?? throw new InvalidOperationException("Appointment not found.")
            : await CreateAppointment(entry);
        ApplySchedule(appointment, entry);
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
        foreach (var name in entry.Treatments)
        {
            dto.Treatments.Add(new CalendarEntryTreatmentDto { Name = name, CalendarEntry = dto });
        }

        _ = await _entries.AddAsync(dto);
    }

    public async Task UpdateEntry(Guid id, CalendarEntry entry)
    {
        var dto = await _entries
            .Include(existing => existing.Appointment)
            .Include(existing => existing.Treatments)
            .SingleOrDefaultAsync(existing => existing.Id == id)
            ?? throw new InvalidOperationException($"Calendar entry {id} not found.");

        await ReassignCustomer(dto.Appointment, entry.CustomerId);
        ApplySchedule(dto.Appointment, entry);
        dto.Appointment.Description = entry.Notes ?? string.Empty;
        dto.Money = entry.Money;
        UpdateTreatments(dto, entry);
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
        _ = context.Set<AppointmentDto>().Remove(dto.Appointment);
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

    private async Task<AppointmentDto> CreateAppointment(CalendarEntry entry)
    {
        var customer = await FindCustomer(entry.CustomerId);
        var approvedStatus = await context.Set<AppointmentStatusDto>().FindAsync(AppointmentStatus.Approved.Value)
            ?? throw new InvalidOperationException("Appointment status not found.");

        var appointment = new AppointmentDto
        {
            Language = "sr",
            Description = string.Empty,
            Status = approvedStatus
        };
        AssignCustomer(appointment, customer);
        ApplySchedule(appointment, entry);
        _ = await context.Set<AppointmentDto>().AddAsync(appointment);
        return appointment;
    }

    private async Task ReassignCustomer(AppointmentDto appointment, Guid customerId)
    {
        if (customerId == Guid.Empty || customerId == appointment.CustomerId)
        {
            return;
        }

        AssignCustomer(appointment, await FindCustomer(customerId));
    }

    private async Task<CustomerDto> FindCustomer(Guid customerId) =>
        await context.Set<CustomerDto>()
            .Include(customer => customer.Phones)
            .Include(customer => customer.Emails)
            .SingleOrDefaultAsync(customer => customer.Id == customerId)
            ?? throw new InvalidOperationException("Customer not found.");

    private static void AssignCustomer(AppointmentDto appointment, CustomerDto customer)
    {
        var phone = customer.Phones.First();
        var email = customer.Emails.FirstOrDefault();
        appointment.CustomerId = customer.Id;
        appointment.Customer = customer;
        appointment.Phone = phone.PhoneNumber ?? string.Empty;
        appointment.Email = email?.Email;
        appointment.CustomerPhone = phone;
        appointment.CustomerEmail = email;
    }

    private static void ApplySchedule(AppointmentDto appointment, CalendarEntry entry)
    {
        appointment.ScheduledFor = new DateTimeOffset(entry.Date.ToDateTime(entry.StartTime), TimeSpan.Zero);
        appointment.ExpectedEndTime = new DateTimeOffset(entry.Date.ToDateTime(entry.EndTime), TimeSpan.Zero);
    }
}
