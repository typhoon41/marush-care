using Gmf.DDD.Common.Persistance;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Infrastructure.Data.Entities.Customers;

namespace Gmf.Marush.Care.Infrastructure.Data.Entities.Calendar;
public record CalendarEntryDto : EntityDto
{
    public DateOnly Date { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string? ClientName { get; set; }
    public string? ClientPhone { get; set; }
    public string? ClientEmail { get; set; }
    public Guid? CustomerId { get; set; }
    public CustomerDto? Customer { get; set; }
    public string? Notes { get; set; }
    public decimal? Money { get; set; }

    public CalendarEntry ToDomain() => new(Id, Date, StartTime, EndTime,
        ClientName, ClientPhone, ClientEmail, CustomerId, Notes, Money);

    public static CalendarEntryDto FromDomain(CalendarEntry entry) => new()
    {
        Date = entry.Date,
        StartTime = entry.StartTime,
        EndTime = entry.EndTime,
        ClientName = entry.ClientName,
        ClientPhone = entry.ClientPhone,
        ClientEmail = entry.ClientEmail,
        CustomerId = entry.CustomerId,
        Notes = entry.Notes,
        Money = entry.Money
    };
}
