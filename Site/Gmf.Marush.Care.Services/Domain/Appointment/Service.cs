using Gmf.DDD.Common.Abstractions;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Contracts.Services;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Services.Domain.Appointment;
public class Service(IAppointmentRepository appointmentRepository, ICustomerRepository customerRepository) : IAppointmentService
{
    private readonly IAppointmentRepository _appointmentRepository = appointmentRepository;
    private readonly ICustomerRepository _customerRepository = customerRepository;

    public async Task<Guid> Schedule(Customer customer, Period appointment)
    {
        var existingCustomer = _customerRepository.FindCustomerBy(customer.Email, customer.Phone);

        if (existingCustomer != null)
        {
            var customerFound = new ExistingCustomer(existingCustomer, customer.Email, customer.Phone);
            return await _appointmentRepository.ScheduleExisting(customerFound, appointment);
        }

        return await _appointmentRepository.ScheduleNew(customer, appointment);
    }
}
