using Gmf.Marush.Care.Infrastructure.Data.Entities.Appointments;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>Reads appointment rows straight from the database, to see what a request actually stored.</summary>
public sealed class StoredAppointments(MarushApiFactory factory)
{
    public async Task<IReadOnlyList<AppointmentDto>> ForEmail(string email) =>
        await factory.QueryDatabase(async context => await WithDetails(context.Set<AppointmentDto>())
            .Where(appointment => appointment.Email == email)
            .ToListAsync(TestContext.Current.CancellationToken));

    public async Task<IReadOnlyList<AppointmentDto>> ForCustomer(Guid customerId) =>
        await factory.QueryDatabase(async context => await WithDetails(context.Set<AppointmentDto>())
            .Where(appointment => appointment.CustomerId == customerId)
            .ToListAsync(TestContext.Current.CancellationToken));

    public async Task<AppointmentDto?> ById(Guid id) =>
        await factory.QueryDatabase(async context => await WithDetails(context.Set<AppointmentDto>())
            .SingleOrDefaultAsync(appointment => appointment.Id == id, TestContext.Current.CancellationToken));

    public async Task<AppointmentDto> SingleForEmail(string email) => (await ForEmail(email)).Single();

    public async Task<IReadOnlyList<CalendarEntryDto>> EntriesFor(Guid appointmentId) =>
        await factory.QueryDatabase(async context => await context.Set<CalendarEntryDto>()
            .Where(entry => entry.AppointmentId == appointmentId)
            .ToListAsync(TestContext.Current.CancellationToken));

    private static IQueryable<AppointmentDto> WithDetails(IQueryable<AppointmentDto> appointments) => appointments
        .AsNoTracking()
        .Include(appointment => appointment.Status)
        .Include(appointment => appointment.Treatments)
        .Include(appointment => appointment.Customer);
}
