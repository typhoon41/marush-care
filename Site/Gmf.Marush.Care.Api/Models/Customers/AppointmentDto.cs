namespace Gmf.Marush.Care.Api.Models.Customers;

public class AppointmentDto
{
    public DateOnly Date { get; set; }
    public string Description { get; set; } = string.Empty;
}
