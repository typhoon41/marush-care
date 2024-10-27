using Gmf.Marush.Care.Api.Models;
using Gmf.Marush.Care.Api.Models.Templates;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Services.Application.Contracts;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Gmf.Marush.Care.Api.Controllers;

[Route("[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class AppointmentController(IAppointmentRepository appointmentRepository, INotifyAboutAppointments appointmentService, IWebHostEnvironment environment) : ControllerBase
{
    private readonly IAppointmentRepository _appointmentRepository = appointmentRepository;
    private readonly INotifyAboutAppointments _appointmentService = appointmentService;
    private readonly IWebHostEnvironment _environment = environment;

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Post([FromBody][Required] AppointmentRequest data)
    {
        await _appointmentRepository.Schedule(data.Customer, data.Period());
        var webRootPath = _environment.WebRootPath;
        await _appointmentService.SendAppointmentNotificationTo(data.Customer, new AppointmentSubmittedTemplate(webRootPath), new AppointmentRequestTemplate(webRootPath));
        return data != null ? Ok() : (StatusCodeResult)BadRequest();
    }
}
