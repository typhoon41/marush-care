namespace Gmf.Marush.Care.Api.Models.Customers;

public class CustomerListItemDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
}
