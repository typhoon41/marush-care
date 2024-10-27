namespace Gmf.Marush.Care.Api.Models.Templates;

public class AppointmentSubmittedTemplate(string webRootPath) : BaseMarushTemplate(webRootPath)
{
    protected override string FileName => "appointment-submitted.html";
    protected override IDictionary<string, string> Replacements { get; } = new Dictionary<string, string>()
    {
        { "{{content}}", "Podnet zahtev!" }
    };
}
