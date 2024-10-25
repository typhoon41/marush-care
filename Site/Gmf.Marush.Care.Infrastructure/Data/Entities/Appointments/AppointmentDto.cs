using Gmf.DDD.Common.Contracts;
using Gmf.DDD.Common.Persistance;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;

namespace Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
public class AppointmentDto : EntityDto<IDomainEvent>
{
    public Guid CustomerId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTimeOffset ScheduledFor { get; set; }
    public DateTimeOffset ExpectedEndTime { get; set; }
    public string Description { get; set; } = string.Empty;
    public CustomerDto Customer { get; set; } = new CustomerDto();
    public AppointmentStatusDto Status { get; set; } = new AppointmentStatusDto();
    public CustomerPhoneDto CustomerPhone { get; set; } = new CustomerPhoneDto();
    public CustomerEmailDto CustomerEmail { get; set; } = new CustomerEmailDto();
}
