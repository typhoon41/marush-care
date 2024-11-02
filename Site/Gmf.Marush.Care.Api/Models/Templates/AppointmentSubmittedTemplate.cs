using Gmf.Marush.Care.Api.Resources;

namespace Gmf.Marush.Care.Api.Models.Templates;

public class AppointmentSubmittedTemplate(AppointmentRequest appointment, string webRootPath,
    string phoneNumber) : BaseMarushRequestTemplate(appointment, webRootPath)
{
    protected override string FileName => "appointment-submitted.html";

    protected override IEnumerable<KeyValuePair<string, string>> AdditionalReplacements() => new Dictionary<string, string>()
    {
        { "{{welcome-title}}", Labels.Welcome },
        { "{{title}}", Labels.AtMarush },
        { "{{order}}", Labels.BookedTreatments },
        { "{{total}}", Labels.Total },
        { "{{disclaimer}}", Labels.Disclaimer + phoneNumber },
    };
}
