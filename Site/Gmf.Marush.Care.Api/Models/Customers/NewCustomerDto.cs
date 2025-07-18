namespace Gmf.Marush.Care.Api.Models.Customers;

public class NewCustomerDto
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public IEnumerable<string> Emails { get; set; } = [];
    public IEnumerable<string> Phones { get; set; } = [];
    public DateOnly DateOfBirth { get; set; }
    public string PlaceOfResidence { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string Allergies { get; set; } = string.Empty;
    public string Comments { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
}
