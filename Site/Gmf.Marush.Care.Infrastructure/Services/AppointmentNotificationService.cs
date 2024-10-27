using Gmf.Mail.Common.Contracts;
using Gmf.Mail.Common.Models;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Services.Application.Contracts;

namespace Gmf.Marush.Care.Infrastructure.Services;

public class AppointmentNotificationService(ISendEmailTemplate emailService, SmtpSettings smtpSettings) : INotifyAboutAppointments
{
    private readonly ISendEmailTemplate
        _emailService = emailService ?? throw new ArgumentNullException(nameof(emailService));
    private readonly SmtpSettings _smtpSettings = smtpSettings;

    public async Task SendAppointmentNotificationTo(Customer customer, BaseEmailTemplate customerTemplate, BaseEmailTemplate ownerTemplate)
    {
        await _emailService.Send(customer.Email, customerTemplate, "Marush: Space of Care - zahtev za zakazivanje termina je podnet");
        await _emailService.Send(_smtpSettings.From, ownerTemplate, "Marush: Space of Care - zahtev za zakazivanje termina");
    }
}
