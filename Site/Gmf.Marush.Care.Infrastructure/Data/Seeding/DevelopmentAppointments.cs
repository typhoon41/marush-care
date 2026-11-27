using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data.Seeding;

/// <summary>
/// Adds the seeded visits the way the app stores them: a calendar entry keeps its wall-clock time,
/// an online request keeps the instant it has in the server's time zone (see <see cref="CalendarSlot"/>).
/// </summary>
public class DevelopmentAppointments(IReadOnlyList<CustomerDto> customers, DateOnly monday)
{
    private const string Language = "sr";

    public async Task AddTo(DbContext context, CancellationToken cancellationToken)
    {
        var statuses = context.Set<AppointmentStatusDto>();
        var performed = await Find(statuses, AppointmentStatus.Performed, cancellationToken);
        var approved = await Find(statuses, AppointmentStatus.Approved, cancellationToken);
        var requested = await Find(statuses, AppointmentStatus.Requested, cancellationToken);
        var rejected = await Find(statuses, AppointmentStatus.Rejected, cancellationToken);

        context.AddRange(DevelopmentVisits.Performed.Select(visit => EntryFor(visit, performed)));
        context.AddRange(DevelopmentVisits.Approved.Select(visit => EntryFor(visit, approved)));
        context.AddRange(DevelopmentVisits.Requested.Select(visit => RequestFor(visit, requested)));
        context.AddRange(DevelopmentVisits.Rejected.Select(visit => RequestFor(visit, rejected)));
    }

    private CalendarEntryDto EntryFor(DevelopmentVisit visit, AppointmentStatusDto status)
    {
        var appointment = AppointmentFor(visit, status);
        appointment.Schedule(visit.PeriodIn(monday));
        return new CalendarEntryDto { Id = Guid.NewGuid(), AppointmentId = appointment.Id, Appointment = appointment };
    }

    private AppointmentDto RequestFor(DevelopmentVisit visit, AppointmentStatusDto status)
    {
        var appointment = AppointmentFor(visit, status);
        var slot = CalendarSlot.Of(visit.PeriodIn(monday));
        appointment.ScheduledFor = slot.RequestedStart;
        appointment.ExpectedEndTime = slot.RequestedEnd;
        appointment.BookedOnline = true;
        return appointment;
    }

    private AppointmentDto AppointmentFor(DevelopmentVisit visit, AppointmentStatusDto status)
    {
        var appointment = new AppointmentDto
        {
            Id = Guid.NewGuid(),
            Language = Language,
            Description = visit.Description,
            Money = visit.Money,
            Status = status
        };
        appointment.AssignCustomer(customers[visit.CustomerIndex]);
        appointment.ReplaceTreatments(visit.Treatments);
        return appointment;
    }

    private static async Task<AppointmentStatusDto> Find(DbSet<AppointmentStatusDto> statuses, AppointmentStatus status,
        CancellationToken cancellationToken) =>
        await statuses.FindAsync([status.Value], cancellationToken)
            ?? throw new InvalidOperationException($"Appointment status {status.DisplayName} is not seeded by the migrations.");
}
