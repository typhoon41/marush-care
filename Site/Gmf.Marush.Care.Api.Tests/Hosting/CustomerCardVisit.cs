namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>One row of the client card's visit history.</summary>
public sealed record CustomerCardVisit(string Date, string Description)
{
    public static CustomerCardVisit On(DateOnly date, string description) => new(WireFormat.Date(date), description);
}
