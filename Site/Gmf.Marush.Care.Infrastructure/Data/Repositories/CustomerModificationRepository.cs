using Gmf.DDD.Common.Concepts;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Bcpg;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

public class CustomerModificationRepository(DbContext context) : ICustomerModificationRepository
{
    private readonly DbSet<CustomerDto> _customers = context.Set<CustomerDto>();

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await _customers.FindAsync(id);
        if (entity is null)
        {
            return false;
        }

        _ = _customers.Remove(entity);
        return true;
    }

    public async Task StoreAsync(CustomerDetails customer, Guid userId)
    {
        var admin = new UserDto() { Id = userId };
        context.Set<UserDto>().Attach(admin);

        if (customer.Id is null)
        {
            await Create(customer, admin);
        }

        else
        {
            Update(customer, customer.Id.Value, admin);
        }
    }

    private async Task Create(CustomerDetails customer, UserDto user)
    {
        var entity = CustomerDto.MapFrom(new CustomerDto(), customer, user);
        SetContactDetailsFor(customer, entity);
        AddAppointmentsFor(customer, entity);

        _ = await _customers.AddAsync(entity);
    }

    private void AddAppointmentsFor(CustomerDetails customer, CustomerDto entity)
    {
        foreach (var appointment in customer.Appointments)
        {
            var status = new AppointmentStatusDto { Id = AppointmentStatus.Performed.Value };
            context.Set<AppointmentStatusDto>().Attach(status);
            entity.Appointments.Add(AppointmentDto.MapFrom(customer, appointment, status, entity));
        }
    }

    private void Update(CustomerDetails customer, Guid id, UserDto user)
    {
        var entity = context.Set<CustomerDto>()
            .Include(context => context.Phones)
            .Include(context => context.Emails)
            .Include(context => context.Properties)
            .Include(context => context.Appointments)
            .ThenInclude(appointment => appointment.CustomerEmail)
            .Include(context => context.Appointments)
            .ThenInclude(appointment => appointment.CustomerPhone)
            .Include(context => context.Appointments)
            .ThenInclude(appointment => appointment.Status)
            .SingleOrDefault(entity => entity.Id == id)
            ?? throw new InvalidOperationException($"Customer with id {id} not found for update.");

        _ = CustomerDto.MapFrom(entity, customer, user);

        SetContactDetailsFor(customer, entity);
        SetAppointmentsFor(customer, entity);
    }

    private void SetAppointmentsFor(CustomerDetails customer, CustomerDto entity)
    {
        var incomingDates = customer.Appointments.Select(appointment => appointment.Date).ToHashSet();
        var existingByDate = entity.Appointments
            .Where(appointment => appointment.MapToStatus().IsExecuted())
            .ToDictionary(appointment => DateOnly.FromDateTime(appointment.ScheduledFor.DateTime), appointment => appointment);

        var toRemove = entity.Appointments
            .Where(a => !incomingDates.Contains(DateOnly.FromDateTime(a.ScheduledFor.DateTime)))
            .ToList();

        foreach (var remove in toRemove)
        {
            entity.Appointments.Remove(remove);
        }

        var newStatus = new AppointmentStatusDto { Id = AppointmentStatus.Performed.Value };
        var statusId = newStatus.Id;
        var statusSet = context.Set<AppointmentStatusDto>();

        var status = statusSet.Local.FirstOrDefault(s => s.Id == statusId)
            ?? entity.Appointments.Select(a => a.Status).FirstOrDefault(s => s.Id == statusId)
            ?? statusSet.Attach(newStatus).Entity;

        foreach (var incoming in customer.Appointments)
        {
            if (existingByDate.TryGetValue(incoming.Date, out var existing))
            {
                existing.Description = incoming.Description;
            }
            else
            {
                var newAppointment = AppointmentDto.MapFrom(customer, incoming, status, entity);
                entity.Appointments.Add(newAppointment);
            }
        }
    }

    private void SetContactDetailsFor(CustomerDetails customer, CustomerDto entity)
    {
        var incomingPhones = customer.Phones.ToHashSet(StringComparer.Ordinal);
        var incomingEmails = customer.Emails.ToHashSet(StringComparer.OrdinalIgnoreCase);

        var phonesToRemove = entity.Phones.Where(p => !incomingPhones.Contains(p.PhoneNumber)).ToList();

        // Ensure there's at least one phone left if any appointment exists (DB requires NOT NULL)
        var remainingPhoneNumber =
            entity.Phones.Where(p => incomingPhones.Contains(p.PhoneNumber)).Select(p => p.PhoneNumber).FirstOrDefault()
            ?? incomingPhones.First();
        var phoneNumbersToRemove = phonesToRemove.Select(p => p.PhoneNumber).ToHashSet();

        foreach (var appointment in entity.Appointments)
        {
            if (phoneNumbersToRemove.Contains(appointment.Phone))
            {
                appointment.Phone = remainingPhoneNumber;
            }
        }

        foreach (var remove in phonesToRemove)
        {
            entity.Phones.Remove(remove);
            context.Remove(remove);
        }

        var emailsToRemove = entity.Emails.Where(e => !incomingEmails.Contains(e.Email)).ToList();

        foreach (var remove in emailsToRemove)
        {
            entity.Emails.Remove(remove);
            context.Remove(remove);
        }

        foreach (var phone in incomingPhones)
        {
            if (entity.Phones.Any(p => p.PhoneNumber == phone))
            {
                continue;
            }

            var newPhone = new CustomerPhoneDto { PhoneNumber = phone, Customer = entity };
            entity.Phones.Add(newPhone);
            context.Add(newPhone);
        }

        foreach (var email in incomingEmails)
        {
            if (entity.Emails.Any(e => string.Equals(e.Email, email, StringComparison.OrdinalIgnoreCase)))
            {
                continue;
            }

            var newEmail = new CustomerEmailDto { Email = email, Customer = entity };
            entity.Emails.Add(newEmail);
            context.Add(newEmail);
        }
    }
}
