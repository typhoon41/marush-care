using System.Globalization;
using Gmf.DDD.Common.Concepts;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Domain.Exceptions;

public class CalendarSlotTakenException(CalendarPeriod period)
    : DomainConflictException($"The calendar slot {period.Format(CultureInfo.InvariantCulture)} is already taken.")
{
    public CalendarPeriod Period { get; } = period;
}
