using Gmf.Marush.Care.Api.Models;
using Gmf.Marush.Care.Domain.Contracts.Services.Appointments;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Gmf.Marush.Care.Api.Controllers;

[Route("[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class AppointmentController(IMakeAppointments appointmentService) : ControllerBase
{
    private readonly IMakeAppointments _appointmentService = appointmentService ?? throw new ArgumentNullException(nameof(appointmentService));

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Post([FromBody][Required] AppointmentRequest data)
    {
        await _appointmentService.ScheduleAppointmentFor(data.Customer, data.Period());
        //Poslati klijentu mail
        //Poslati Mariji mail

        return data != null ? Ok() : (StatusCodeResult)BadRequest();
    }
}
