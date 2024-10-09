using Gmf.Mail.Common.Contracts;
using Gmf.Mail.Common.Models;
using Microsoft.Extensions.Logging;

namespace Gmf.Mail.Common.Clients;
public class EmailClientStub(SmtpSettings settings, ILogger<EmailClientStub> logger) : BaseEmailClient(settings, logger), IEmailClient
{
    public void Send(EmailMessage email)
    {
        if (!Directory.Exists(Settings.PickupDirectoryLocation))
        {
            _ = Directory.CreateDirectory(Settings.PickupDirectoryLocation);
        }

        using var message = CreateMimeFrom(email);

        var filePath = Path.Combine(Settings.PickupDirectoryLocation, $"{DateTime.UtcNow.Ticks}.eml");
        message.WriteTo(filePath);

        Logger.LogDebug("Email '{Subject}' is written to filesystem: {FilePath}", message.Subject, filePath);
    }
}
