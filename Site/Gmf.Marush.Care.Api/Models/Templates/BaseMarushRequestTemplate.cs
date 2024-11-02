using System.Globalization;

namespace Gmf.Marush.Care.Api.Models.Templates;

public abstract class BaseMarushRequestTemplate(AppointmentRequest appointment, string webRootPath) : BaseMarushTemplate(webRootPath)
{
    protected override IDictionary<string, string> Replacements => CommonReplacements.Union(AdditionalReplacements()).ToDictionary(x => x.Key, x => x.Value);

    protected abstract IEnumerable<KeyValuePair<string, string>> AdditionalReplacements();

    private IDictionary<string, string> CommonReplacements => new Dictionary<string, string>()
    {
        { "{{services}}", GenerateListFrom(appointment.Treatments) },
        { "{{date}}", appointment.Period().StartDate.ToString("g",  CultureInfo.CurrentCulture) },
        { "{{sum}}", appointment.Sum.ToString(CultureInfo.InvariantCulture) }
    };

    private static string GenerateListFrom(IEnumerable<string> treatments)
    {
        var result = string.Empty;
        foreach (var treatment in treatments)
        {
            result += $"<h4 style=\"font-size: 24px;line-height: 37px;letter-spacing: 3px;margin-bottom: 15px;font-family: 'Overpass-bold', 'Arial', 'Helvetica', 'Tahoma';margin-top: 0;text-transform: uppercase;\"><span style=\"color:#f5b57b;margin-right:10px;\">*</span><span>{treatment}</span></h4>";
        }

        return result;
    }
}
