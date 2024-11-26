using Gmf.Marush.Care.Api.Resources;

namespace Gmf.Marush.Care.Api.Models.Templates;

internal class AppointmentRejectionTemplate(string webRootPath, string phoneNumber, string date) : BaseMarushTemplate(webRootPath)
{
    protected override string FileName => "appointment-rejection.html";
    protected override IDictionary<string, string> Replacements { get; } = new Dictionary<string, string>()
    {
        { "{{title}}", Labels.AppointmentRejectedSubtitle },
        { "{{text}}", Labels.AppointmentRejectedText },
        { "{{date}}", date },
        { "{{phone-number}}", phoneNumber },
        { "{{phone-number-formatted}}", phoneNumber.ToFormattedPhone() }
    };
}
