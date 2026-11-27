using System.Collections.Concurrent;
using Gmf.Mail.Common.Models;

namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>
/// Every email the API handed to its email client, in sending order. EmailClientStub's pickup files cannot serve as the
/// record: each is named after DateTime.UtcNow.Ticks, so two emails sent within one clock tick overwrite each other.
/// </summary>
public sealed class EmailOutbox
{
    private readonly ConcurrentQueue<EmailMessage> _delivered = new();
    private readonly ConcurrentQueue<EmailMessage> _failed = new();
    private readonly ConcurrentDictionary<string, bool> _unreachableRecipients = new(StringComparer.OrdinalIgnoreCase);

    public IReadOnlyList<EmailMessage> Delivered => [.. _delivered];

    public IReadOnlyList<EmailMessage> Failed => [.. _failed];

    public void MakeUnreachable(string address) => _unreachableRecipients[address] = true;

    public IReadOnlyList<EmailMessage> DeliveredTo(string address) => [.. Delivered.Where(message => IsAddressedTo(message, address))];

    public async Task<EmailMessage> WaitForDeliveryTo(string address) =>
        await Polling.Until(() => Delivered.FirstOrDefault(message => IsAddressedTo(message, address)), $"an email delivered to {address}");

    /// <summary>Records the email, or fails like an unreachable SMTP server when a recipient was made unreachable.</summary>
    public void Accept(EmailMessage email)
    {
        ArgumentNullException.ThrowIfNull(email);
        if (email.To.Any(_unreachableRecipients.ContainsKey))
        {
            _failed.Enqueue(email);
            throw new InvalidOperationException($"Simulated SMTP failure for {string.Join(", ", email.To)}.");
        }

        _delivered.Enqueue(email);
    }

    private static bool IsAddressedTo(EmailMessage message, string address) => message.To.Contains(address, StringComparer.OrdinalIgnoreCase);
}
