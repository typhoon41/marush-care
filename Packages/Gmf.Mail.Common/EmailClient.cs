using Gmf.Mail.Common.Contracts;
using Gmf.Mail.Common.Models;
using MailKit.Security;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace Gmf.Mail.Common;

public class EmailClient(SmtpSettings settings, ILogger<EmailClient> logger) : BaseEmailClient(settings, logger), IEmailClient
{
    public async Task Send(EmailMessage email)
    {
        var stopWatch = new Stopwatch();

        using var message = CreateMimeFrom(email);
        using (var smtpClient = new SmtpClient())
        {
            await smtpClient.ConnectAsync(Settings.Server, Settings.Port, SecureSocketOptions.StartTls);
            await smtpClient.AuthenticateAsync(Settings.Username, Settings.Password);
            _ = await smtpClient.SendAsync(message);
            await smtpClient.DisconnectAsync(true);
        }

        logger.LogDebug("Email {Subject}, using host: {Server} and port: {Port}, sent in [{ElapsedMilliseconds}ms]",
            message.Subject, Settings.Server, Settings.Port, stopWatch.ElapsedMilliseconds);
    }
}
