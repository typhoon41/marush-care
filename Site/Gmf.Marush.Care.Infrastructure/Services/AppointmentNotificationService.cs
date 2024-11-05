using Gmf.Mail.Common.Contracts;
using Gmf.Mail.Common.Models;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Services.Application.Contracts;
using Gmf.Marush.Care.Services.Models;

namespace Gmf.Marush.Care.Infrastructure.Services;

public class AppointmentNotificationService(IAppointmentRepository appointmentRepository, ISendEmailTemplate emailService, SmtpSettings smtpSettings) : INotifyAboutAppointments
{
    private readonly IAppointmentRepository _appointmentRepository = appointmentRepository;
    private readonly ISendEmailTemplate _emailService = emailService;
    private readonly SmtpSettings _smtpSettings = smtpSettings;

    public async Task SendAppointmentNotificationTo(Customer customer, NotificationDetails notificationDetails)
    {
        try
        {
            await _emailService.Send(_smtpSettings.From, notificationDetails.SecondaryTemplate, "Marush: Space of Care - zahtev za zakazivanje termina");
            await _emailService.Send(customer.Email, notificationDetails.PrimaryTemplate, notificationDetails.PrimaryTitle);
        }
        catch
        {
            _appointmentRepository.DetachAll();
            throw;
        }
    }

    public async Task<bool> SendDecisionNotification(bool decision, Guid appointmentId, NotificationDetails notificationDetails)
    {
        try
        {
            var email = _appointmentRepository.MakeDecisionFor(appointmentId, decision);

            if (email == null)
            {
                return false;
            }

            var template = decision ? notificationDetails.PrimaryTemplate : notificationDetails.SecondaryTemplate;
            var title = decision ? notificationDetails.PrimaryTitle : notificationDetails.SecondaryTitle;
            await _emailService.Send(email, template, title);
            return true;
        }
        catch
        {
            return false;
        }
    }
}
