using Gmf.Marush.Care.Domain.Models;
using Gmf.Marush.Care.Services.Models;

namespace Gmf.Marush.Care.Services.Application.Contracts;
public interface INotifyAboutAppointments
{
    Task SendAppointmentNotificationTo(Customer customer, NotificationDetails notificationDetails);
    Task<bool> SendDecisionNotification(bool decision, Guid appointmentId, Func<NotificationDetails> getNotificationDetails);
}
