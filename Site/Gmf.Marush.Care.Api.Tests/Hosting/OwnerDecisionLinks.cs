using System.Net;
using System.Text.RegularExpressions;

namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>The accept and reject links of the owner's "new request" email, as the owner clicks them.</summary>
public sealed partial class OwnerDecisionLinks
{
    private OwnerDecisionLinks(Uri accept, Uri reject)
    {
        Accept = accept;
        Reject = reject;
    }

    public Uri Accept { get; }

    public Uri Reject { get; }

    public static async Task<OwnerDecisionLinks> For(MarushApiFactory factory, Guid appointmentId)
    {
        ArgumentNullException.ThrowIfNull(factory);
        var id = appointmentId.ToString();
        var email = await Polling.Until(() => factory.Emails.DeliveredTo(MarushApiFactory.OwnerAddress)
            .FirstOrDefault(message => message.Content.Contains(id, StringComparison.Ordinal)), $"the owner email for {id}");
        var links = DecisionLink().Matches(email.Content)
            .Select(match => WebUtility.HtmlDecode(match.Groups["link"].Value))
            .ToList();
        return new OwnerDecisionLinks(
            new Uri(links.Single(link => link.Contains("Accepted=true", StringComparison.Ordinal))),
            new Uri(links.Single(link => link.Contains("Accepted=false", StringComparison.Ordinal))));
    }

    [GeneratedRegex("href=\"(?<link>[^\"]*/api/appointment/decision[^\"]*)\"")]
    private static partial Regex DecisionLink();
}
