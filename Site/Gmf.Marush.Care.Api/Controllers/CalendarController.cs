using Gmf.Mail.Common.Contracts;
using Gmf.Mail.Common.Models;
using Gmf.Marush.Care.Api.Models.Calendar;
using Gmf.Marush.Care.Api.Models.Templates;
using Gmf.Marush.Care.Api.Resources;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gmf.Marush.Care.Api.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
[Authorize]
public class CalendarController(ICalendarRepository calendarRepository,
    ISendEmailTemplate emailService,
    SmtpSettings smtpSettings) : ControllerBase
{
    [HttpGet("week")]
    [ProducesResponseType(typeof(CalendarWeekResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetWeek([FromQuery] DateOnly weekStart)
    {
        var monday = weekStart.AddDays(-(int)weekStart.DayOfWeek == 0 ? 6 : (int)weekStart.DayOfWeek - 1);
        var entries = await calendarRepository.GetEntriesForWeekAsync(monday);
        var publicAppointments = await calendarRepository.GetPublicAppointmentsForWeekAsync(monday);
        var notes = await calendarRepository.GetNotesForWeekAsync(monday);

        var response = new CalendarWeekResponse(
            monday,
            entries.Select(e => new CalendarEntryResponse(e.Id, e.Date, e.StartTime, e.EndTime,
                e.ClientName, e.ClientPhone, e.ClientEmail, e.CustomerId, e.Notes, e.Money)),
            publicAppointments.Select(a => new PublicAppointmentResponse(a.Id, a.Date, a.StartTime, a.EndTime,
                a.ClientName, a.Phone, a.Email, a.Status, a.Description)),
            notes.Select(n => new CalendarNoteResponse(n.Id, n.Date, n.Type.DisplayName, n.Content)));

        return Ok(response);
    }

    [HttpPost("entry")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateEntry(CalendarEntryRequest request)
    {
        var entry = MapToDomain(Guid.NewGuid(), request);
        await calendarRepository.AddEntryAsync(entry);
        return Created();
    }

    [HttpPut("entry/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateEntry(Guid id, CalendarEntryRequest request)
    {
        var existing = await calendarRepository.GetEntryByIdAsync(id);
        if (existing is null) return NotFound();

        var timeChanged = existing.Date != request.Date
            || existing.StartTime != request.StartTime
            || existing.EndTime != request.EndTime;

        var updated = MapToDomain(id, request);
        await calendarRepository.UpdateEntryAsync(id, updated);

        if (timeChanged && !string.IsNullOrWhiteSpace(existing.ClientEmail))
        {
            await SendRescheduleEmail(existing, request);
        }

        return NoContent();
    }

    [HttpDelete("entry/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteEntry(Guid id)
    {
        var deleted = await calendarRepository.DeleteEntryAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("note")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpsertNote(CalendarNoteRequest request)
    {
        var noteType = request.NoteType == "Weekly" ? CalendarNoteType.Weekly : CalendarNoteType.Daily;
        var note = new CalendarNote(Guid.Empty, request.Date, noteType, request.Content);
        await calendarRepository.UpsertNoteAsync(note);
        return NoContent();
    }

    [HttpDelete("note/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteNote(Guid id)
    {
        var deleted = await calendarRepository.DeleteNoteAsync(id);
        return deleted ? NoContent() : NotFound();
    }

    private static CalendarEntry MapToDomain(Guid id, CalendarEntryRequest request) =>
        new(id, request.Date, request.StartTime, request.EndTime,
            request.ClientName, request.ClientPhone, request.ClientEmail,
            request.CustomerId, request.Notes, request.Money);

    private async Task SendRescheduleEmail(CalendarEntry old, CalendarEntryRequest updated)
    {
        var oldDateTime = $"{old.Date:dd.MM.yyyy} {old.StartTime:HH:mm}–{old.EndTime:HH:mm}";
        var newDateTime = $"{updated.Date:dd.MM.yyyy} {updated.StartTime:HH:mm}–{updated.EndTime:HH:mm}";
        var template = new AppointmentRescheduledTemplate(smtpSettings.Username, oldDateTime, newDateTime);
        await emailService.Send(old.ClientEmail!, template, Labels.AppointmentRescheduledTitle);
    }
}
