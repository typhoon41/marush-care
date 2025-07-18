namespace Gmf.Marush.Care.Domain.Models;
public record CustomerDetails(Guid Id, string Name, string Surname, IEnumerable<string> Phones, IEnumerable<string> Emails,
    DateOnly? DateOfBirth, string? PlaceOfResidence, string? Diagnosis, string? Allergies, string? Comments, string? Notes)
{
}
