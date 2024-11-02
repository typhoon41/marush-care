using Gmf.Marush.Care.Api.Models;
using Gmf.Marush.Care.Api.Models.Templates;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Infrastructure.Injection.Configuration;
using Gmf.Marush.Care.Services.Application.Contracts;
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
        await _appointmentService.SendAppointmentNotificationTo(data.Customer, CustomerTemplateFrom(data), OwnerTemplateFrom(data, appointmentId));
        return Ok();
    }

    private AppointmentRequestTemplate OwnerTemplateFrom(AppointmentRequest data, Guid appointmentId) =>
        new(data, _environment.WebRootPath, $"{Request.Scheme}://{Request.Host}/api/appointment/decision", data.Phone, appointmentId);
    private AppointmentSubmittedTemplate CustomerTemplateFrom(AppointmentRequest data) => new(data, _environment.WebRootPath, contactSettings.PhoneNumber);
}
