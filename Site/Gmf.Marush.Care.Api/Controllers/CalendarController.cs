using System.Globalization;
using Gmf.Mail.Common.Contracts;
using Gmf.Mail.Common.Models;
using Gmf.Marush.Care.Api.Models.Calendar;
using Gmf.Marush.Care.Api.Models.Templates;
using Gmf.Marush.Care.Api.Resources;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Enumerations;
using Gmf.Marush.Care.Domain.Models;
using Gmf.Net.Core.Common.Initialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Gmf.Marush.Care.Api.Controllers;

[Route("api/[controller]")]
[Produces("application/json")]
[Consumes("application/json")]
[Authorize]
public class CalendarController(ICalendarRepository calendarRepository,
    ISendEmailTemplate emailService,
    SmtpSettings smtpSettings,
    CultureResolver cultureResolver) : ControllerBase
{
    private const int SundayDayOfWeek = 0;
    private const int DaysFromSundayToMonday = 6;

    [HttpGet("week")]
    [ProducesResponseType(typeof(CalendarWeekDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetWeek([FromQuery] DateOnly weekStart)
    {
        var monday = MondayOf(weekStart);
        var entries = await calendarRepository.GetEntriesForWeek(monday);
        var publicAppointments = await calendarRepository.GetPublicAppointmentsForWeek(monday);
        var notes = await calendarRepository.GetNotesForWeek(monday);

        var response = new CalendarWeekDto(
            monday,
            entries.Select(entry => new CalendarEntryDto(entry.Id, entry.AppointmentId!.Value, entry.Date, entry.StartTime, entry.EndTime, entry.Notes, entry.Money)),
            publicAppointments.Select(appointment => new PublicAppointmentDto(appointment.Id, appointment.Date, appointment.StartTime, appointment.EndTime,
                appointment.ClientName, appointment.Phone, appointment.Email, appointment.Status, appointment.Description)),
            notes.Select(note => new CalendarNoteDto(note.Id, note.Date, note.Type.DisplayName, note.Content)));

        return Ok(response);
    }

    [HttpPost("entry")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateEntry(NewCalendarEntryDto request)
    {
        var entry = MapToDomain(Guid.NewGuid(), request);
        await calendarRepository.AddEntry(entry);
        return Created();
    }

    [HttpPut("entry/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateEntry(Guid id, NewCalendarEntryDto request)
    {
        var existing = await calendarRepository.GetEntryById(id);
        if (existing is null) {
            return NotFound();
        }

        var timeChanged = existing.Date != request.Date
            || existing.StartTime != request.StartTime
            || existing.EndTime != request.EndTime;

        await calendarRepository.UpdateEntry(id, MapToDomain(id, request));

        if (timeChanged)
        {
            var contact = await calendarRepository.GetAppointmentContact(existing.AppointmentId!.Value);
            if (contact is not null)
            {
                await SendRescheduleEmail(existing, request, contact.Value.Email, contact.Value.Language);
            }
        }

        return NoContent();
    }

    [HttpDelete("entry/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteEntry(Guid id)
    {
        var deleted = await calendarRepository.DeleteEntry(id);
        return deleted ? NoContent() : NotFound();
    }

    [HttpPost("note")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpsertNote(NewCalendarNoteDto request)
    {
        var note = new CalendarNote(Guid.Empty, request.Date, CalendarNoteType.From(request.NoteType), request.Content);
        await calendarRepository.UpsertNote(note);
        return NoContent();
    }

    [HttpDelete("note/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteNote(Guid id)
    {
        var deleted = await calendarRepository.DeleteNote(id);
        return deleted ? NoContent() : NotFound();
    }

    private static DateOnly MondayOf(DateOnly date)
    {
        var dayOfWeek = (int)date.DayOfWeek;
        var daysFromMonday = dayOfWeek == SundayDayOfWeek ? DaysFromSundayToMonday : dayOfWeek - 1;
        return date.AddDays(-daysFromMonday);
    }

    private static CalendarEntry MapToDomain(Guid id, NewCalendarEntryDto request) =>
        new(id, request.AppointmentId, request.CustomerId ?? Guid.Empty,
            request.Date, request.StartTime, request.EndTime,
            request.Notes, request.Money);

    private async Task SendRescheduleEmail(CalendarEntry old, NewCalendarEntryDto updated, string email, string language)
    {
        cultureResolver.SetCulture(language);
        var culture = CultureInfo.CurrentCulture;
        var oldDateTime = $"{old.Date.ToString("d", culture)} {old.StartTime.ToString("t", culture)}–{old.EndTime.ToString("t", culture)}";
        var newDateTime = $"{updated.Date.ToString("d", culture)} {updated.StartTime.ToString("t", culture)}–{updated.EndTime.ToString("t", culture)}";
        var template = new AppointmentRescheduledTemplate(smtpSettings.Username, oldDateTime, newDateTime);
        await emailService.Send(email, template, Labels.AppointmentRescheduledTitle);
    }
}
