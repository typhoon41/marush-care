using Gmf.Mail.Common.Contracts;
using Gmf.Mail.Common.Models;

namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>
/// Decorates the API's own email client (EmailClientStub, since Smtp:UsePickupDirectory is true), so every email is
/// recorded in the outbox and then still written to the pickup directory. A decorator applies whatever the order of
/// registrations, unlike a replacement, which Program's EmailModule registration would override.
/// </summary>
public sealed class RecordingEmailClient(IEmailClient client, EmailOutbox outbox) : IEmailClient
{
    public async Task Send(EmailMessage email)
    {
        outbox.Accept(email);
        await client.Send(email);
    }
}
