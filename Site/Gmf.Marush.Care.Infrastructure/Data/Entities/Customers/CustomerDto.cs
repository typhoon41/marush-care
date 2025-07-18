﻿using Gmf.DDD.Common.Persistance;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;

namespace Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
public record CustomerDto : EntityDto
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public CustomerPropertiesDto? Properties { get; set; }
    public IEnumerable<AppointmentDto> Appointments { get; } = new List<AppointmentDto>();
    public IList<CustomerPhoneDto> Phones { get; } = [];
    public IList<CustomerEmailDto> Emails { get; } = [];
}
