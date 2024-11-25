using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;

namespace Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;

public class CustomerEmailDto
{
    public string Email { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public virtual CustomerDto Customer { get; set; } = new CustomerDto();
    public virtual IEnumerable<AppointmentDto> Appointments { get; set; } = new List<AppointmentDto>();
}
