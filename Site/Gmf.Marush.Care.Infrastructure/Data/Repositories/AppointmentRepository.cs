using System.Globalization;
using Gmf.DDD.Common.Abstractions;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;
public class AppointmentRepository(MarushCareContext context) : IAppointmentRepository
{
    private readonly DbSet<AppointmentDto> _appointments = context.Set<AppointmentDto>();
    private readonly MarushCareContext _context = context ?? throw new ArgumentNullException(nameof(context));

    public (string Email, string Language)? Make(AppointmentDecision decision)
    {
        var newStatus = GetStatus(decision.NewStatus);
        var appointment = _appointments.Include(a => a.Status).SingleOrDefault(u => u.Id == decision.AppointmentId);

        if (AppointmentDecision.MadeOnOutdated(appointment?.Status.Id))
        {
            return null;
        }

        appointment!.Status = newStatus;
        return (appointment.Email, appointment.Language);
    }

    public async Task<Guid> ScheduleNew(Customer customer, Period appointment)
    {
        var statusRequested = GetStatus();
        var newCustomer = new CustomerDto
        {
            Name = customer.Name,
            Surname = customer.Surname
        };

        return await Create(customer, appointment, statusRequested, newCustomer);
    }

    public async Task<Guid> ScheduleExisting(ExistingCustomer customer, Period appointment)
    {
        var statusRequested = GetStatus();
        var oldCustomerEntity = GetFetchedEntity<CustomerDto>(x => x.Id == customer.Id)!;
        var previouslyUsedEmail = GetFetchedEntity<CustomerEmailDto>(x => x.Email == customer.GivenMail);
        var previouslyUsedPhone = GetFetchedEntity<CustomerPhoneDto>(x => x.PhoneNumber == customer.GivenPhone);

        return await Create(customer, appointment, statusRequested, oldCustomerEntity, previouslyUsedEmail, previouslyUsedPhone);
    }

    private async Task<Guid> Create(Customer customer, Period appointment, AppointmentStatusDto statusRequested, CustomerDto newCustomer,
        CustomerEmailDto? previouslyUsedEmail = null, CustomerPhoneDto? previouslyUsedPhone = null)
    {


        var newAppointment = new AppointmentDto
        {
            Language = CultureInfo.CurrentCulture.TwoLetterISOLanguageName,
            ScheduledFor = appointment.StartDate,
            ExpectedEndTime = appointment.EndDate,
            Customer = newCustomer,
            CustomerPhone = previouslyUsedPhone ?? new CustomerPhoneDto
            {
                Customer = newCustomer,
                PhoneNumber = customer.Phone
            },
            CustomerEmail = previouslyUsedEmail ?? new CustomerEmailDto()
            {
                Customer = newCustomer,
                Email = customer.Email
            },
            Status = statusRequested
        };

        _ = await _appointments.AddAsync(newAppointment);
        return newAppointment.Id;
    }

    public void DetachAll()
    {
        foreach (var entry in _context.ChangeTracker.Entries())
        {
            entry.State = EntityState.Detached;
        }
    }

    private AppointmentStatusDto GetStatus(Guid? statusId = null)
    {
        var statusRequested = new AppointmentStatusDto { Id = statusId ?? AppointmentStatus.Requested.Value };
        _ = _context.Set<AppointmentStatusDto>().Attach(statusRequested);
        return statusRequested;
    }

    private T? GetFetchedEntity<T>(Func<T, bool> expression) =>
        _context.ChangeTracker.Entries()
                .Select(e => e.Entity)
                .OfType<T>()
                .SingleOrDefault(expression);
}
