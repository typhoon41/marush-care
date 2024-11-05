using Gmf.DDD.Common.Contracts;
using Gmf.DDD.Common.Persistance;

namespace Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
public record AppointmentStatusDto : EntityDto<IDomainEvent>
{
    public string Name { get; set; } = string.Empty;
    public IList<AppointmentDto> Appointments { get; set; } = [];
}
