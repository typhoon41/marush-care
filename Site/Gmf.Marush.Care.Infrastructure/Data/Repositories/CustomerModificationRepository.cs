using Gmf.DDD.Common.Concepts;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Domain.Models;
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
        if (customer.Id is null)
        {
            await Create(customer, userId);
        }

        else
        {
            Update(customer, customer.Id.Value, userId);
        }
    }

    private async Task Create(CustomerDetails customer, Guid userId)
    {
        var entity = CustomerDto.MapFrom(new CustomerDto(), customer, userId);
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

    private void Update(CustomerDetails customer, Guid id, Guid userId)
    {
        var entity = context.Set<CustomerDto>()
            .Include(context => context.Phones)
            .Include(context => context.Emails)
            .Include(context => context.Properties)
            .Include(context => context.Appointments)
            .SingleOrDefault(entity => entity.Id == id)
            ?? throw new InvalidOperationException($"Customer with id {id} not found for update.");

        _ = CustomerDto.MapFrom(entity, customer, userId);
        entity.Phones.Clear();
        entity.Emails.Clear();

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

        foreach (var incoming in customer.Appointments)
        {
            if (existingByDate.TryGetValue(incoming.Date, out var existing))
            {
                existing.Description = incoming.Description;
            }
            else
            {
                var status = new AppointmentStatusDto { Id = AppointmentStatus.Performed.Value };
                context.Set<AppointmentStatusDto>().Attach(status);

                entity.Appointments.Add(AppointmentDto.MapFrom(customer, incoming, status, entity));
            }
        }
    }

    private static void SetContactDetailsFor(CustomerDetails customer, CustomerDto entity)
    {
        foreach (var phone in customer.Phones)
        {
            entity.Phones.Add(new CustomerPhoneDto { PhoneNumber = phone });
        }

        foreach (var email in customer.Emails)
        {
            entity.Emails.Add(new CustomerEmailDto { Email = email });
        }
    }
}
