using Gmf.Mail.Common.Models;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Services.Application.Contracts;
public interface INotifyAboutAppointments
{
    Task SendAppointmentNotificationTo(Customer customer, BaseEmailTemplate customerTemplate, BaseEmailTemplate ownerTemplate);
}
