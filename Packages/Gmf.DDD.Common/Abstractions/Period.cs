namespace Gmf.DDD.Common.Abstractions;
public sealed record Period
{
    public Period(DateTimeOffset startDate, DateTimeOffset endDate)
    {
        if (startDate > endDate)
        {
            throw new ArgumentOutOfRangeException(nameof(startDate), $@"{nameof(startDate)} should be < {nameof(endDate)}");
        }

        StartDate = startDate.UtcDateTime;
        EndDate = endDate.UtcDateTime;
    }

    public DateTimeOffset StartDate { get; }

    public DateTimeOffset EndDate { get; }

    public bool Contains(DateTimeOffset date) => date >= StartDate && date <= EndDate;

    public bool InFuture(TimeProvider timeProvider) => StartDate > timeProvider.GetUtcNow();

    public bool InPast(TimeProvider timeProvider) => EndDate < timeProvider.GetUtcNow();

    public bool InPresent(TimeProvider timeProvider) => Contains(timeProvider.GetUtcNow());

    public int InMinutes => (int)Math.Round((EndDate - StartDate).TotalMinutes);

    public override string ToString() => $"[{StartDate:d}, {EndDate:d}]";
}
