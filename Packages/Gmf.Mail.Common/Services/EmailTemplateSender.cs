using Gmf.Mail.Common.Contracts;
using Gmf.Mail.Common.Models;

namespace Gmf.Mail.Common.Services;
public class EmailTemplateSender(IEmailClient emailService) : ISendEmailTemplate
{
    private readonly IEmailClient _emailService = emailService;

    public async Task Send(string emailAddress, BaseEmailTemplate emailTemplate, string title)
    {
        var message = new EmailMessage(title, await emailTemplate.GenerateEmailContent(), new[] { emailAddress });
        await _emailService.Send(message);
    }
}
