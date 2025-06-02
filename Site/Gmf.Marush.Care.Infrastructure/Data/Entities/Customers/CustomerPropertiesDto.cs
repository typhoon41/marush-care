namespace Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;

public record CustomerPropertiesDto
{
    public Guid CustomerId { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string PlaceOfResidence { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string Allergies { get; set; } = string.Empty;
    public string Comments { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public CustomerDto Customer { get; set; } = new CustomerDto();
}
