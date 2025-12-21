namespace Gmf.Marush.Care.Api.Models.Customers;

public class NewCustomerDto
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public IEnumerable<string> Emails { get; set; } = [];
    public IEnumerable<string> Phones { get; set; } = [];
    public IEnumerable<AppointmentDto> Appointments { get; set; } = [];
    public DateOnly? Birthday { get; set; }
    public string? City { get; set; } = string.Empty;
    public string? Diagnosis { get; set; } = string.Empty;
    public string? Allergies { get; set; } = string.Empty;
    public string? Comments { get; set; } = string.Empty;
    public string? Remarks { get; set; } = string.Empty;
}
