using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;

/// <summary>The appointment behind a calendar entry: which one it is, and whose it is.</summary>
public class CalendarEntryAppointments(DbContext context)
{
    private readonly DbSet<AppointmentDto> _appointments = context.Set<AppointmentDto>();

    /// <summary>
    /// The online request the entry is created from, or a new approved appointment for its customer.
    /// Null when that request or customer does not exist.
    /// </summary>
    public async Task<AppointmentDto?> For(CalendarEntry entry) =>
        entry.AppointmentId.HasValue
            ? await _appointments.FindAsync(entry.AppointmentId.Value)
            : await CreateFor(entry.CustomerId);

    /// <summary>False when the customer does not exist; the appointment is left as it was.</summary>
    public async Task<bool> Reassign(AppointmentDto appointment, Guid customerId)
    {
        if (customerId == Guid.Empty || customerId == appointment.CustomerId)
        {
            return true;
        }

        var customer = await FindCustomer(customerId);
        if (customer is null)
        {
            return false;
        }

        appointment.AssignCustomer(customer);
        return true;
    }

    public void Remove(AppointmentDto appointment) => _ = _appointments.Remove(appointment);

    private async Task<AppointmentDto?> CreateFor(Guid customerId)
    {
        var customer = await FindCustomer(customerId);
        if (customer is null)
        {
            return null;
        }

        var approvedStatus = await context.Set<AppointmentStatusDto>().FindAsync(AppointmentStatus.Approved.Value)
            ?? throw new InvalidOperationException("Appointment status not found.");

        var appointment = new AppointmentDto
        {
            Language = "sr",
            Description = string.Empty,
            Status = approvedStatus
        };
        appointment.AssignCustomer(customer);
        _ = await _appointments.AddAsync(appointment);
        return appointment;
    }

    private async Task<CustomerDto?> FindCustomer(Guid customerId) =>
        await context.Set<CustomerDto>()
            .Include(customer => customer.Phones)
            .Include(customer => customer.Emails)
            .SingleOrDefaultAsync(customer => customer.Id == customerId);
}
