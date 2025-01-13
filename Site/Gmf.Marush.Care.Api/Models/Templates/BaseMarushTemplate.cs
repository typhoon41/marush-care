using Gmf.Mail.Common.Models;

namespace Gmf.Marush.Care.Api.Models.Templates;

internal abstract class BaseMarushTemplate : BaseEmailTemplate
{
    protected override string TemplatePath => Path.Combine(AppContext.BaseDirectory, "Resources", "Email Templates", FileName);
    protected abstract string FileName { get; }
}
