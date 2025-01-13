using Gmf.Marush.Care.Api.Resources;

namespace Gmf.Marush.Care.Api.Models.Templates;

internal class AppointmentConfirmationTemplate(string phoneNumber, string date) : BaseMarushTemplate
{
    protected override string FileName => "appointment-confirmation.html";
    protected override IDictionary<string, string> Replacements { get; } = new Dictionary<string, string>()
    {
        { "{{title}}", Labels.AppointmentAcceptedSubtitle },
        { "{{text}}", Labels.AppointmentAcceptedText },
        { "{{location}}", Labels.Location },
        { "{{location-value}}", "Višegradska 25/7" },
        { "{{date}}", Labels.AppointmentTime },
        { "{{date-value}}", date },
        { "{{disclaimer}}", Labels.Disclaimer },
        { "{{phone-number}}", phoneNumber },
        { "{{phone-number-formatted}}", phoneNumber.ToFormattedPhone() }
    };
}
