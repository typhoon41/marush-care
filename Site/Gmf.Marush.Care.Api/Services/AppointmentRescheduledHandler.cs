using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using Gmf.DDD.Common.Contracts;
using Gmf.Mail.Common.Contracts;
using Gmf.Marush.Care.Api.Models.Templates;
using Gmf.Marush.Care.Api.Resources;
using Gmf.Marush.Care.Domain.Events.Calendar;
using Gmf.Marush.Care.Infrastructure.Injection.Configuration;
using Gmf.Net.Core.Common.Initialization;

namespace Gmf.Marush.Care.Api.Services;

[SuppressMessage("Maintainability", "CA1515:Consider making public types internal",
    Justification = "Has to be public due to reachability through DI")]
public class AppointmentRescheduledHandler(ISendEmailTemplate emailService, ContactSettings contactSettings,
    CultureResolver cultureResolver) : IHandleDomainEvents
{
    public async Task Handle(IDomainEvent notification, CancellationToken cancellationToken = default)
    {
        if (notification is not AppointmentRescheduled rescheduled)
        {
            return;
        }

        cultureResolver.SetCulture(rescheduled.Language);
        var culture = CultureInfo.CurrentCulture;
        var template = new AppointmentRescheduledTemplate(contactSettings.PhoneNumber,
            rescheduled.Previous.Format(culture), rescheduled.Current.Format(culture));
        await emailService.Send(rescheduled.Email, template, Labels.AppointmentRescheduledTitle);
    }
}
