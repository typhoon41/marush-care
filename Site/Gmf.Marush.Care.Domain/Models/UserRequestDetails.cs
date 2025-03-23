using Gmf.DDD.Common.Concepts;

namespace Gmf.Marush.Care.Domain.Models;

public class UserRequestDetails(string ipAddress, string browser, string referrer) : ValueObject
{
    public string IpAddress { get; } = ipAddress;
    public string Browser { get; } = browser;
    public string Referrer { get; } = referrer;

    protected override IEnumerable<object> GetAtomicValues() => [IpAddress, Browser, Referrer];
}
