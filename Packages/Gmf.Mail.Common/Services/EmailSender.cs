using Gmf.Mail.Common.Contracts;
using Gmf.Mail.Common.Models;
using Gmf.Net.Core.Common.Logging.Contracts;

namespace Gmf.Mail.Common.Services;
public class EmailSender(IEmailClient emailService) : ISendEmailTemplate, ISendEmail
{
    private readonly IEmailClient _emailService = emailService;

    public async Task Send(string emailAddress, BaseEmailTemplate emailTemplate, string title)
    {
        var message = new EmailMessage(title, await emailTemplate.GenerateEmailContent(), new[] { emailAddress });
        await _emailService.Send(message);
    }

    public async Task Send(string emailAddress, string title, string content)
    {
        var message = new EmailMessage(title, content, new[] { emailAddress });
        await _emailService.Send(message);
    }
}
