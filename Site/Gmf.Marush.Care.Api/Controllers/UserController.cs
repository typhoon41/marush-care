using System.ComponentModel.DataAnnotations;
using Gmf.Marush.Care.Domain.Contracts.Services;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Net.Core.Common.Security;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;

namespace Gmf.Marush.Care.Api.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
public class UserController(IUserService userService) : ControllerBase
{
    [HttpPost("login")]
    [ServiceFilter(typeof(ValidateCaptchaAttribute))]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login([FromBody][Required] LoginRequest request)
    {
        var user = GetUserFrom(request);

        if (!await userService.ValidateAsync(user))
        {
            return BadRequest();
        }

        var token = userService.GenerateJwtToken(request.Email);
        return Ok(new { Token = token });
    }

#if DEBUG
    [HttpPost("create")]
    [ServiceFilter(typeof(ValidateCaptchaAttribute))]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Create([FromBody][Required] LoginRequest request) =>
        await userService.CreateAsync(GetUserFrom(request)) ? Ok() : BadRequest();
#endif

    private User GetUserFrom(LoginRequest request) => new(request.Email, request.Password, GetUserRequestDetails());

    private UserRequestDetails GetUserRequestDetails()
    {
        var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
        var headers = Request.Headers;
        var userAgent = headers.UserAgent.ToString();
        var referer = headers.Referer.ToString();

        return new UserRequestDetails(ipAddress ?? string.Empty, userAgent, referer);
    }
}
