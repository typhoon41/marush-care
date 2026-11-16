namespace Gmf.Marush.Care.Domain.Models;

/// <summary>The treatments an appointment is booked for, by their catalog names, and what they cost together.</summary>
public record TreatmentSelection(IReadOnlyCollection<string> Treatments, decimal Money)
{
    public const int MaximumTreatments = 20;
}
