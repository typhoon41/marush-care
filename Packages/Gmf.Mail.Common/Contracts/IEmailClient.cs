using Gmf.Mail.Common.Models;

namespace Gmf.Mail.Common.Contracts;
public interface IEmailClient
{
    void Send(EmailMessage email);
}
