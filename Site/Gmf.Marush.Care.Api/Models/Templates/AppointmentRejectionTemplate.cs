namespace Gmf.Marush.Care.Api.Models.Templates;

public class AppointmentRejectionTemplate(string webRootPath) : BaseMarushTemplate(webRootPath)
{
    protected override string FileName => "appointment-rejection.html";
    protected override IDictionary<string, string> Replacements { get; } = new Dictionary<string, string>()
    {
        { "{{content}}", "Podnet zahtev!" }
    };
}
