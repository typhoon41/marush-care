using Gmf.Mail.Common.Models;

namespace Gmf.Mail.Common.Contracts;
public interface ISendEmailTemplate
{
    Task Send(string emailAddress, BaseEmailTemplate emailTemplate, string title);
}
