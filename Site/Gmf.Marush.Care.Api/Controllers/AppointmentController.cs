using Gmf.Marush.Care.Api.Models;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace Gmf.Marush.Care.Api.Controllers;

[Route("[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class AppointmentController : ControllerBase
{
    //[HttpPost]
    //[ProducesResponseType(StatusCodes.Status200OK)]
    //[ProducesResponseType(StatusCodes.Status400BadRequest)]
    //public async Task<IActionResult> Post([FromBody][Required] AppointmentRequest data)
    //{
    // // Upisati zahtev u bazu
    // Poslati klijentu mail
    // Poslati Mariji mail

    //    return data != null ? Ok() : (StatusCodeResult)BadRequest();
    //}

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult Post([FromBody][Required] AppointmentRequest data) => data != null ? Ok() : (StatusCodeResult)BadRequest();
}
