using Gmf.Marush.Care.Api.Resources;

namespace Gmf.Marush.Care.Api.Models.Templates;

internal class AppointmentRescheduledTemplate(string phoneNumber, string oldDate, string newDate) : BaseMarushTemplate
{
    protected override string FileName => "appointment-rescheduled.html";
    protected override IDictionary<string, string> Replacements { get; } = new Dictionary<string, string>()
    {
        { "{{title}}", Labels.AppointmentRescheduledSubtitle },
        { "{{text}}", Labels.AppointmentRescheduledText },
        { "{{old-date-label}}", Labels.AppointmentRescheduledOldDate },
        { "{{old-date-value}}", oldDate },
        { "{{new-date-label}}", Labels.AppointmentRescheduledNewDate },
        { "{{new-date-value}}", newDate },
        { "{{disclaimer}}", Labels.Disclaimer },
        { "{{phone-number}}", phoneNumber },
        { "{{phone-number-formatted}}", phoneNumber.ToFormattedPhone() }
    };
}
