using Gmf.DDD.Common.Contracts;
using Gmf.DDD.Common.Persistance;

namespace Gmf.Marush.Care.Infrastructure.Data.Entities;
public class AppointmentDto : EntityDto<IDomainEvent>
{
    public CustomerDto Customer { get; set; } = new CustomerDto();
    public DateTime ScheduledFor { get; set; }
    public int TreatmentsDuration { get; set; }
    public string Description { get; set; } = string.Empty;
}
