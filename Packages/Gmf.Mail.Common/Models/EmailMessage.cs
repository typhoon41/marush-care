namespace Gmf.Mail.Common.Models;
public class EmailMessage
{
    public string Subject { get; }
    public string Content { get; }
    public IEnumerable<string> To { get; }

    public EmailMessage(string subject, string content, IEnumerable<string> to)
    {
        Subject = subject ?? throw new ArgumentNullException(nameof(subject));
        Content = content ?? throw new ArgumentNullException(nameof(content));
        To = to ?? throw new ArgumentNullException(nameof(to));

        if (!to.Any())
        {
            throw new InvalidOperationException(@"You cannot create an email message without receivers!");
        }
    }
}
