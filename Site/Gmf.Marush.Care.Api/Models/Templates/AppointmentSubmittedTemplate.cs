﻿using Gmf.Marush.Care.Api.Resources;

namespace Gmf.Marush.Care.Api.Models.Templates;

internal class AppointmentSubmittedTemplate(AppointmentRequest appointment, string phoneNumber) : BaseMarushRequestTemplate(appointment, phoneNumber)
{
    protected override string FileName => "appointment-submitted.html";

    protected override IEnumerable<KeyValuePair<string, string>> AdditionalReplacements() => new Dictionary<string, string>()
    {
        { "{{welcome-title}}", Labels.Welcome },
        { "{{date}}", Appointment.FormattedAppointmentStart },
        { "{{title}}", Labels.AtMarush },
        { "{{order}}", Labels.BookedTreatments },
        { "{{services}}", GenerateListFrom(Appointment.Treatments) },
        { "{{total}}", Labels.ExpectedBill },
        { "{{interval}}", Labels.OnInterval },
        { "{{disclaimer}}", Labels.Disclaimer }
    };
}
