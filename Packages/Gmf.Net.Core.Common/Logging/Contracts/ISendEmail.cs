namespace Gmf.Net.Core.Common.Logging.Contracts;

public interface ISendEmail
{
    Task Send(string emailAddress, string title, string content);
}
