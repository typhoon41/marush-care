using Gmf.DDD.Common.Concepts;

namespace Gmf.Marush.Care.Domain.Enumerations;
public class AppointmentStatus(Guid value, string displayName) : Enumeration<Guid>(value, displayName)
{
    public static AppointmentStatus Requested { get; } = new(Guid.Parse("c932c2d0-ac07-4f10-a1f9-a934175881f2"), nameof(Requested));
    public static AppointmentStatus Rejected { get; } = new(Guid.Parse("26c7dd9f-b501-4116-8438-00a5549d2555"), nameof(Rejected));
    public static AppointmentStatus Approved { get; } = new(Guid.Parse("b14a3e57-15c6-4de2-bd70-431e00e14520"), nameof(Approved));
    public static AppointmentStatus Performed { get; } = new(Guid.Parse("4f8b1835-c724-4635-bef7-30b2f1c37965"), nameof(Performed));
}
