using Gmf.DDD.Common.Contracts;
using Gmf.DDD.Common.Persistance;

namespace Gmf.Marush.Care.Infrastructure.Data.Entities;
public class CustomerDto : EntityDto<IDomainEvent>
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public IEnumerable<AppointmentDto> Appointments { get; } = new List<AppointmentDto>();
}
