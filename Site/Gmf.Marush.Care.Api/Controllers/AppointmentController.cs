using System.ComponentModel.DataAnnotations;
using Gmf.Marush.Care.Api.Models;
using Gmf.Marush.Care.Api.Models.Templates;
using Gmf.Marush.Care.Api.Resources;
using Gmf.Marush.Care.Domain.Contracts.Services;
using Gmf.Marush.Care.Infrastructure.Injection.Configuration;
using Gmf.Marush.Care.Services.Application.Contracts;
using Gmf.Marush.Care.Services.Models;
using Gmf.Net.Core.Common.Security;
using Microsoft.AspNetCore.Mvc;

namespace Gmf.Marush.Care.Api.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class AppointmentController(IAppointmentService appointmentService, ContactSettings contactSettings,
    INotifyAboutAppointments notificationService) : ControllerBase
{
    private readonly IAppointmentService _appointmentService = appointmentService;
    private readonly INotifyAboutAppointments _notificationService = notificationService;

    [HttpPost]
    [ServiceFilter(typeof(ValidateCaptchaAttribute))]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Post([FromBody][Required] AppointmentRequest data)
    {
        var appointmentId = await _appointmentService.Schedule(data.Customer, data.Period());
        var notificationDetails = new NotificationDetails
        {
            PrimaryTemplate = CustomerTemplateFrom(data),
            PrimaryTitle = Labels.AppointmentSubmitedTitle,
            SecondaryTemplate = OwnerTemplateFrom(data, appointmentId)
        };
        await _notificationService.SendAppointmentNotificationTo(data.Customer, notificationDetails);
        return Ok();
    }

    [HttpGet("decision")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Decision([FromQuery][Required] AppointmentDecision data)
    {
        NotificationDetails notificationDetails()
        {
            return new()
            {
                PrimaryTemplate = ConfirmationTemplate(contactSettings, data),
                PrimaryTitle = Labels.AppointmentAcceptedTitle,
                SecondaryTemplate = RejectionTemplate(contactSettings, data),
                SecondaryTitle = Labels.AppointmentRejectedTitle
            };
        }

        var result = await _notificationService.SendDecisionNotification(data.Accepted, data.AppointmentId, notificationDetails);

        return result ? Redirect("https://marushcare.com/sr/klijent-obave%C5%A1ten") : Redirect("https://marushcare.com/sr/gre%C5%A1ka/sistemska");
    }

    private static AppointmentRejectionTemplate RejectionTemplate(ContactSettings contactSettings, AppointmentDecision data) => new(contactSettings.PhoneNumber, data.Date);
    private static AppointmentConfirmationTemplate ConfirmationTemplate(ContactSettings contactSettings, AppointmentDecision data) =>
        new(contactSettings.PhoneNumber, data.Date);
    private AppointmentRequestTemplate OwnerTemplateFrom(AppointmentRequest data, Guid appointmentId) =>
        new(data, $"{Request.Scheme}://{Request.Host}/api/appointment/decision", data.Phone, appointmentId);

    private AppointmentSubmittedTemplate CustomerTemplateFrom(AppointmentRequest data) => new(data, contactSettings.PhoneNumber);
}
