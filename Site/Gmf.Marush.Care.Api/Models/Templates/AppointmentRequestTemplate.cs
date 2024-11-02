namespace Gmf.Marush.Care.Api.Models.Templates;

public class AppointmentRequestTemplate(AppointmentRequest appointment, string webRootPath,
    string apiLocation, Guid appointmentId) : BaseMarushRequestTemplate(appointment, webRootPath)
{
    private readonly AppointmentRequest _appointment = appointment;

    protected override string FileName => "appointment-request.html";

    protected override IEnumerable<KeyValuePair<string, string>> AdditionalReplacements() => new Dictionary<string, string>()
    {
        { "{{client}}", _appointment.FullName },
        { "{{endpoint}}", apiLocation },
        { "{{appointmentId}}", appointmentId.ToString() }
    };
}
