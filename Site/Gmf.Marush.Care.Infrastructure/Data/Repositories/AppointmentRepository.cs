using Gmf.DDD.Common.Abstractions;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data.Repositories;
public class AppointmentRepository(MarushCareContext context, ICustomerRepository customerRepository) : IAppointmentRepository
{
    private readonly DbSet<AppointmentDto> _appointments = context.Set<AppointmentDto>();
    private readonly MarushCareContext _context = context ?? throw new ArgumentNullException(nameof(context));
    private readonly ICustomerRepository _customerRepository = customerRepository ?? throw new ArgumentNullException(nameof(customerRepository));

    public async Task Schedule(Customer customer, Period appointment)
    {
        var existingUser = _customerRepository.FindCustomerBy(customer.Email, customer.Phone);
        var statusRequested = new AppointmentStatusDto { Id = AppointmentStatus.Requested.Value };
        _ = _context.Set<AppointmentStatusDto>().Attach(statusRequested);

        if (existingUser != null)
        {
            await ScheduleExisting(customer, appointment, existingUser, statusRequested);
            return;
        }

        await ScheduleNew(customer, appointment, statusRequested);
    }

    private async Task ScheduleNew(Customer customer, Period appointment, AppointmentStatusDto statusRequested)
    {
        var newCustomer = new CustomerDto
        {
            Name = customer.Name,
            Surname = customer.Surname
        };
        _ = await _appointments.AddAsync(new AppointmentDto
        {
            ScheduledFor = appointment.StartDate,
            ExpectedEndTime = appointment.EndDate,
            Customer = newCustomer,
            CustomerPhone = new CustomerPhoneDto
            {
                Customer = newCustomer,
                PhoneNumber = customer.Phone
            },
            CustomerEmail = new CustomerEmailDto()
            {
                Customer = newCustomer,
                Email = customer.Email
            },
            Status = statusRequested
        });
    }

    private async Task ScheduleExisting(Customer customer, Period appointment, Customer existingUser, AppointmentStatusDto statusRequested)
    {
        var oldCustomer = GetFetchedEntity<CustomerDto>(x => x.Id == existingUser.Id)!;
        var oldEmail = GetFetchedEntity<CustomerEmailDto>(x => x.Email == customer.Email);
        var oldPhone = GetFetchedEntity<CustomerPhoneDto>(x => x.PhoneNumber == existingUser.Phone);
        _ = await _appointments.AddAsync(new AppointmentDto
        {
            CustomerEmail = oldEmail ?? new CustomerEmailDto()
            {
                Customer = oldCustomer,
                Email = customer.Email
            },
            CustomerPhone = oldPhone ?? new CustomerPhoneDto
            {
                Customer = oldCustomer,
                PhoneNumber = customer.Phone
            },
            Customer = oldCustomer,
            ScheduledFor = appointment.StartDate,
            ExpectedEndTime = appointment.EndDate,
            Status = statusRequested
        });
    }

    private T? GetFetchedEntity<T>(Func<T, bool> expression) =>
        _context.ChangeTracker.Entries()
                .Select(e => e.Entity)
                .OfType<T>()
                .SingleOrDefault(expression);
}
