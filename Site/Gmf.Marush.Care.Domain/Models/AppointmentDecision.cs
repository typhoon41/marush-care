using Gmf.Marush.Care.Domain.Enumerations;

namespace Gmf.Marush.Care.Domain.Models;
public class AppointmentDecision(Guid id, bool approved)
{
    public Guid AppointmentId { get; } = id;
    public Guid NewStatus { get; } = approved ? AppointmentStatus.Approved.Value : AppointmentStatus.Rejected.Value;

    public static bool MadeOnOutdated(Guid? currentStatusId) =>
        !currentStatusId.HasValue || currentStatusId != AppointmentStatus.Requested.Value;
}
