using Gmf.Mail.Common.Contracts;
using Gmf.Mail.Common.Models;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace Gmf.Mail.Common;

public class EmailClient(SmtpSettings settings, ILogger<EmailClient> logger) : BaseEmailClient(settings, logger), IEmailClient
{
    public void Send(EmailMessage email)
    {
        var stopWatch = new Stopwatch();

        using var message = CreateMimeFrom(email);
        using (var smtpClient = new SmtpClient())
        {
            smtpClient.Connect(Settings.Server, Settings.Port);
            if (!string.IsNullOrEmpty(Settings.Username) && !string.IsNullOrEmpty(Settings.Password))
            {
                smtpClient.Authenticate(Settings.Username, Settings.Password);
            }

            _ = smtpClient.Send(message);
            smtpClient.Disconnect(true);
        }

        logger.LogDebug("Email {Subject}, using host: {Server} and port: {Port}, sent in [{ElapsedMilliseconds}ms]",
            message.Subject, Settings.Server, Settings.Port, stopWatch.ElapsedMilliseconds);
    }
}
