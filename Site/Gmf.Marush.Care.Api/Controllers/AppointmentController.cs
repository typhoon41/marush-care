using Gmf.Marush.Care.Api.Models;
using Gmf.Marush.Care.Api.Models.Templates;
using Gmf.Marush.Care.Api.Resources;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Infrastructure.Injection.Configuration;
using Gmf.Marush.Care.Services.Application.Contracts;
using Gmf.Marush.Care.Services.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Gmf.Marush.Care.Api.Controllers;

[Route("[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class AppointmentController(IAppointmentRepository appointmentRepository, ContactSettings contactSettings,
    INotifyAboutAppointments appointmentService, IWebHostEnvironment environment) : ControllerBase
{
    private readonly IAppointmentRepository _appointmentRepository = appointmentRepository;
    private readonly INotifyAboutAppointments _appointmentService = appointmentService;
    private readonly IWebHostEnvironment _environment = environment;

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Post([FromBody][Required] AppointmentRequest data)
    {
        var appointmentId = await _appointmentRepository.Schedule(data.Customer, data.Period());
        var notificationDetails = new NotificationDetails
        {
            PrimaryTemplate = CustomerTemplateFrom(data),
            PrimaryTitle = Labels.AppointmentSubmitedTitle,
            SecondaryTemplate = OwnerTemplateFrom(data, appointmentId)
        };
        await _appointmentService.SendAppointmentNotificationTo(data.Customer, notificationDetails);
        return Ok();
    }

    [HttpPost]
    [Route("[decision]")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Decision([FromBody][Required] AppointmentDecision data)
    {
        var notificationDetails = new NotificationDetails
        {
            PrimaryTemplate = ConfirmationTemplate(contactSettings, data),
            PrimaryTitle = Labels.AppointmentAcceptedTitle,
            SecondaryTemplate = RejectionTemplate(contactSettings, data),
            SecondaryTitle = Labels.AppointmentRejectedTitle
        };
        var result = await _appointmentService.SendDecisionNotification(data.Accepted, data.AppointmentId, notificationDetails);

        return result ? Redirect("https://marushcare.com/sr/klijent-obave%C5%A1ten") : Redirect("https://marushcare.com/sr/gre%C5%A1ka/sistemska");
    }

    private AppointmentRejectionTemplate RejectionTemplate(ContactSettings contactSettings, AppointmentDecision data) => new(_environment.WebRootPath, contactSettings.PhoneNumber, data.Date);
    private AppointmentConfirmationTemplate ConfirmationTemplate(ContactSettings contactSettings, AppointmentDecision data) =>
        new(_environment.WebRootPath, contactSettings.PhoneNumber, data.Date);
    private AppointmentRequestTemplate OwnerTemplateFrom(AppointmentRequest data, Guid appointmentId) =>
        new(data, _environment.WebRootPath, $"{Request.Scheme}://{Request.Host}/api/appointment/decision", data.Phone, appointmentId);
    private AppointmentSubmittedTemplate CustomerTemplateFrom(AppointmentRequest data) => new(data, _environment.WebRootPath, contactSettings.PhoneNumber);
}
