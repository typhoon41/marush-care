using MimeKit;

namespace Gmf.Mail.Common.Models;
public abstract class BaseEmailTemplate
{
    public async Task<string> GenerateEmailContent()
    {
        var builder = new BodyBuilder();
        using (var sourceReader = File.OpenText(TemplatePath))
        {
            builder.HtmlBody = await sourceReader.ReadToEndAsync();
        }

        foreach (var replacement in Replacements)
        {
            builder.HtmlBody = builder.HtmlBody.Replace(replacement.Key, replacement.Value, StringComparison.CurrentCulture);
        }

        return builder.HtmlBody;
    }

    protected abstract string TemplatePath { get; }
    protected virtual IDictionary<string, string> Replacements { get; } = new Dictionary<string, string>();
}
