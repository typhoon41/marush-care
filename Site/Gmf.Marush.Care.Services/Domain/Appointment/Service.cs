using Gmf.DDD.Common.Abstractions;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Contracts.Services.Appointments;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Services.Domain.Appointment;

public class Service(IAppointmentRepository appointmentRepository) : IMakeAppointments
{
    private readonly IAppointmentRepository _appointmentRepository = appointmentRepository ?? throw new ArgumentNullException(nameof(appointmentRepository));

    public async Task ScheduleAppointmentFor(Customer customer, Period period) => await _appointmentRepository.Schedule(customer, period);
}
