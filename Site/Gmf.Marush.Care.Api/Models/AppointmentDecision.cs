namespace Gmf.Marush.Care.Api.Models;

public record AppointmentDecision
{
    public Guid AppointmentId { get; set; }
    public bool Accepted { get; set; }
    public required string Date { get; set; }
}
