using Gmf.DDD.Common.Abstractions;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Services.Appointments;
public interface IMakeAppointments
{
    Task ScheduleAppointmentFor(Customer customer, Period period);
}
