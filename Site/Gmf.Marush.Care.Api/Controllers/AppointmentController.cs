using System.ComponentModel.DataAnnotations;
using Gmf.Marush.Care.Api.Models;
using Gmf.Marush.Care.Api.Models.Templates;
using Gmf.Marush.Care.Api.Resources;
using Gmf.Marush.Care.Domain.Contracts.Services;
using Gmf.Marush.Care.Infrastructure.Injection.Configuration;
using Gmf.Marush.Care.Services.Application.Contracts;
using Gmf.Marush.Care.Services.Models;
using Microsoft.AspNetCore.Mvc;

namespace Gmf.Marush.Care.Api.Controllers;

[Route("[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class AppointmentController(IAppointmentService appointmentService, ContactSettings contactSettings,
    INotifyAboutAppointments notificationService, IWebHostEnvironment environment) : ControllerBase
{
    private readonly IAppointmentService _appointmentService = appointmentService;
    private readonly INotifyAboutAppointments _notificationService = notificationService;
    private readonly IWebHostEnvironment _environment = environment;

    [HttpPost]
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

    [HttpPost("decision")]
    [Consumes("application/x-www-form-urlencoded")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Decision([FromForm][Required] AppointmentDecision data)
    {
        var notificationDetails = new NotificationDetails
        {
            PrimaryTemplate = ConfirmationTemplate(contactSettings, data),
            PrimaryTitle = Labels.AppointmentAcceptedTitle,
            SecondaryTemplate = RejectionTemplate(contactSettings, data),
            SecondaryTitle = Labels.AppointmentRejectedTitle
        };
        var result = await _notificationService.SendDecisionNotification(data.Accepted, data.AppointmentId, notificationDetails);

        return result ? Redirect("https://marushcare.com/sr/klijent-obave%C5%A1ten") : Redirect("https://marushcare.com/sr/gre%C5%A1ka/sistemska");
    }

    private AppointmentRejectionTemplate RejectionTemplate(ContactSettings contactSettings, AppointmentDecision data) => new(_environment.WebRootPath, contactSettings.PhoneNumber, data.Date);
    private AppointmentConfirmationTemplate ConfirmationTemplate(ContactSettings contactSettings, AppointmentDecision data) =>
        new(_environment.WebRootPath, contactSettings.PhoneNumber, data.Date);
    private AppointmentRequestTemplate OwnerTemplateFrom(AppointmentRequest data, Guid appointmentId)
    {
        var apiSubdomain = _environment.IsDevelopment() ? string.Empty : "api/";
        return new(data, _environment.WebRootPath, $"{Request.Scheme}://{Request.Host}/{apiSubdomain}appointment/decision", data.Phone, appointmentId);
    }

    private AppointmentSubmittedTemplate CustomerTemplateFrom(AppointmentRequest data) => new(data, _environment.WebRootPath, contactSettings.PhoneNumber);
}
