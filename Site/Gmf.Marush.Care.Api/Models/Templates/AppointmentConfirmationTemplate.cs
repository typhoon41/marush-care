namespace Gmf.Marush.Care.Api.Models.Templates;

public class AppointmentConfirmationTemplate(string webRootPath) : BaseMarushTemplate(webRootPath)
{
    protected override string FileName => "appointment-confirmation.html";
    protected override IDictionary<string, string> Replacements { get; } = new Dictionary<string, string>()
    {
        { "{{content}}", "Podnet zahtev!" }
    };
}
