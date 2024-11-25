using Gmf.DDD.Common.Abstractions;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Contracts.Services;
public interface IAppointmentService
{
    Task<Guid> Schedule(Customer customer, Period appointment);
}
