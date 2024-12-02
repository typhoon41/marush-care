using Gmf.Mail.Common.Contracts;
using Gmf.Mail.Common.Models;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Services.Application.Contracts;
using Gmf.Marush.Care.Services.Models;
using Gmf.Net.Core.Common.Initialization;
using Microsoft.Extensions.Logging;

namespace Gmf.Marush.Care.Infrastructure.Services;

public class AppointmentNotificationService(IAppointmentRepository appointmentRepository, CultureResolver cultureResolver,
    ISendEmailTemplate emailService, SmtpSettings smtpSettings, ILogger<AppointmentNotificationService> logger) : INotifyAboutAppointments
{
    private readonly IAppointmentRepository _appointmentRepository = appointmentRepository;
    private readonly CultureResolver _cultureResolver = cultureResolver;
    private readonly ISendEmailTemplate _emailService = emailService;
    private readonly SmtpSettings _smtpSettings = smtpSettings;
    private readonly ILogger<AppointmentNotificationService> _logger = logger;

    public async Task SendAppointmentNotificationTo(Customer customer, NotificationDetails notificationDetails)
    {
        try
        {
            await _emailService.Send(_smtpSettings.Username, notificationDetails.SecondaryTemplate, "Marush: Space of Care - zahtev za zakazivanje termina");
            await _emailService.Send(customer.Email, notificationDetails.PrimaryTemplate, notificationDetails.PrimaryTitle);
        }
        catch
        {
            _appointmentRepository.DetachAll();
            throw;
        }
    }

    public async Task<bool> SendDecisionNotification(bool decision, Guid appointmentId, Func<NotificationDetails> getNotificationDetails)
    {
        try
        {
            var appointment = _appointmentRepository.Make(new AppointmentDecision(appointmentId, decision));

            if (!appointment.HasValue)
            {
                return false;
            }

            _cultureResolver.SetCulture(appointment.Value.Language);
            var notificationDetails = getNotificationDetails();
            var template = decision ? notificationDetails.PrimaryTemplate : notificationDetails.SecondaryTemplate;
            var title = decision ? notificationDetails.PrimaryTitle : notificationDetails.SecondaryTitle;
            await _emailService.Send(appointment.Value.Email, template, title);
            return true;
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failure while trying to send decision notification");
            return false;
        }
    }
}
