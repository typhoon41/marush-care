using Gmf.DDD.Common.Abstractions;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Repositories;

public interface IAppointmentRepository
{
    void DetachAll();
    Task<Guid> ScheduleNew(Customer customer, Period appointment, TreatmentSelection treatments);
    Task<Guid> ScheduleExisting(ExistingCustomer customer, Period appointment, TreatmentSelection treatments);
    (string Email, string Language)? Make(AppointmentDecision decision);
}
