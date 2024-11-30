using Gmf.Mail.Common.Models;
using Microsoft.Extensions.Logging;
using MimeKit;
using MimeKit.Text;

namespace Gmf.Mail.Common;
public abstract class BaseEmailClient(SmtpSettings settings, ILogger<BaseEmailClient> logger)
{
    protected ILogger<BaseEmailClient> Logger { get; } = logger ?? throw new ArgumentNullException(nameof(logger));
    protected SmtpSettings Settings { get; } = settings ?? throw new ArgumentNullException(nameof(settings));

    protected MimeMessage CreateMimeFrom(EmailMessage email)
    {
        ArgumentNullException.ThrowIfNull(email);

        var message = new MimeMessage();
        message.To.AddRange(email.To.Select(address => new MailboxAddress(address, address)));
        message.From.Add(new MailboxAddress(settings.FromDescription, Settings.Username));
        message.Subject = email.Subject;
        message.Body = new TextPart(TextFormat.Html)
        {
            Text = email.Content
        };

        return message;
    }
}
