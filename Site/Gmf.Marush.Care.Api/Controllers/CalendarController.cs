using Gmf.Marush.Care.Api.Models.Calendar;
using Gmf.Marush.Care.Domain.Contracts.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gmf.Marush.Care.Api.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
[Authorize]
public class CalendarController(ICalendarService calendarService) : ControllerBase
{
    [HttpGet("week")]
    [ProducesResponseType(typeof(CalendarWeekDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetWeek([FromQuery] DateOnly weekStart) =>
        Ok(CalendarWeekDto.MapFrom(await calendarService.GetWeek(weekStart)));

    [HttpPost("entry")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateEntry(NewCalendarEntryDto request)
    {
        await calendarService.CreateEntry(request.ToDomain(Guid.NewGuid()));
        return Created();
    }

    [HttpPut("entry/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateEntry(Guid id, NewCalendarEntryDto request) =>
        await calendarService.UpdateEntry(id, request.ToDomain(id)) ? NoContent() : NotFound();

    [HttpDelete("entry/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteEntry(Guid id) =>
        await calendarService.DeleteEntry(id) ? NoContent() : NotFound();

    [HttpPost("note")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpsertNote(NewCalendarNoteDto request)
    {
        await calendarService.UpsertNote(request.ToDomain());
        return NoContent();
    }

    [HttpDelete("note/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteNote(Guid id) =>
        await calendarService.DeleteNote(id) ? NoContent() : NotFound();
}
