using Gmf.Mail.Common.Models;

namespace Gmf.Mail.Common.Contracts;
public interface IEmailClient
{
    Task Send(EmailMessage email);
}
