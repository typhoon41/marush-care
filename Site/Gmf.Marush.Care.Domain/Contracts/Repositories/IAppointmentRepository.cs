using Gmf.DDD.Common.Abstractions;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Repositories;

public interface IAppointmentRepository
{
    void DetachAll();
    Task<Guid> ScheduleNew(Customer customer, Period appointment);
    Task<Guid> ScheduleExisting(ExistingCustomer customer, Period appointment);
    string? Make(AppointmentDecision decision);
}
