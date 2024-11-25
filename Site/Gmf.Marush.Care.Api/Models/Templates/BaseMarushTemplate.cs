using Gmf.Mail.Common.Models;

namespace Gmf.Marush.Care.Api.Models.Templates;

public abstract class BaseMarushTemplate(string webRootPath) : BaseEmailTemplate
{
    protected string WebRootPath { get; } = webRootPath;

    protected override string TemplatePath => Path.Combine(WebRootPath, "Email Templates", FileName);

    protected abstract string FileName { get; }
}
