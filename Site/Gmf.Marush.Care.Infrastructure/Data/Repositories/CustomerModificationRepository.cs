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

        var status = new AppointmentStatusDto { Id = AppointmentStatus.Performed.Value };
        context.Set<AppointmentStatusDto>().Attach(status);

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
        foreach (var phone in entity.Phones)
        {
            context.Entry(phone).State = EntityState.Deleted;
        }

        foreach (var email in entity.Emails)
        {
            context.Entry(email).State = EntityState.Deleted;
        }
        entity.Phones.Clear();
        entity.Emails.Clear();

        foreach (var phone in customer.Phones)
        {
            var newPhone = new CustomerPhoneDto { PhoneNumber = phone, Customer = entity };
            context.Set<CustomerPhoneDto>().Add(newPhone);
            entity.Phones.Add(newPhone);
        }

        foreach (var email in customer.Emails)
        {
            var newEmail = new CustomerEmailDto { Email = email, Customer = entity };
            context.Set<CustomerEmailDto>().Add(newEmail);
            entity.Emails.Add(newEmail);
        }
    }
}
