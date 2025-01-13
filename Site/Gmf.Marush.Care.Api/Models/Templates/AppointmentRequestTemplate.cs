namespace Gmf.Marush.Care.Api.Models.Templates;

internal class AppointmentRequestTemplate(AppointmentRequest appointment,
    string apiLocation, string phoneNumber, Guid appointmentId) : BaseMarushRequestTemplate(appointment, phoneNumber)
{
    private readonly AppointmentRequest _appointment = appointment;

    protected override string FileName => "appointment-request.html";

    protected override IEnumerable<KeyValuePair<string, string>> AdditionalReplacements() => new Dictionary<string, string>()
    {
        { "{{date}}", Appointment.SerbianAppointmentStart },
        { "{{client}}", _appointment.FullName },
        { "{{endpoint}}", apiLocation },
        { "{{services}}", GenerateListFrom(Appointment.SerbianTreatments) },
        { "{{appointmentId}}", appointmentId.ToString() }
    };
}
