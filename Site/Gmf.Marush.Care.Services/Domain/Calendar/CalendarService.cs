using Gmf.DDD.Common.Contracts;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Contracts.Services;
using Gmf.Marush.Care.Domain.Events.Calendar;
using Gmf.Marush.Care.Domain.Models;

namespace Gmf.Marush.Care.Services.Domain.Calendar;

public class CalendarService(ICalendarRetrievalRepository retrievalRepository,
    ICalendarModificationRepository modificationRepository,
    IStoreEvents integrationEvents) : ICalendarService
{
    public async Task<CalendarWeek> GetWeek(DateOnly weekStart)
    {
        var monday = CalendarWeek.MondayOf(weekStart);
        return new CalendarWeek(monday,
            await retrievalRepository.GetEntriesForWeek(monday),
            await retrievalRepository.GetPublicAppointmentsForWeek(monday),
            await retrievalRepository.GetNotesForWeek(monday));
    }

    public async Task<CalendarEntrySaveOutcome> CreateEntry(CalendarEntry entry)
    {
        if (await retrievalRepository.IsOccupied(entry.Period, entry.AppointmentId))
        {
            return CalendarEntrySaveOutcome.Overlapping;
        }

        return await modificationRepository.AddEntry(entry) ? CalendarEntrySaveOutcome.Saved : CalendarEntrySaveOutcome.NotFound;
    }

    public async Task<CalendarEntrySaveOutcome> UpdateEntry(Guid id, CalendarEntry entry)
    {
        var existing = await retrievalRepository.GetEntryById(id);
        if (existing is null)
        {
            return CalendarEntrySaveOutcome.NotFound;
        }

        // Only a move is checked, so entries that already overlap stay editable in every other way.
        if (existing.Period != entry.Period && await retrievalRepository.IsOccupied(entry.Period, existing.AppointmentId))
        {
            return CalendarEntrySaveOutcome.Overlapping;
        }

        if (!await modificationRepository.UpdateEntry(id, entry))
        {
            return CalendarEntrySaveOutcome.NotFound;
        }

        await AnnounceRescheduling(existing, entry);
        return CalendarEntrySaveOutcome.Saved;
    }

    public async Task<bool> DeleteEntry(Guid id) => await modificationRepository.DeleteEntry(id);

    public async Task UpsertNote(CalendarNote note) => await modificationRepository.UpsertNote(note);

    public async Task<bool> DeleteNote(Guid id) => await modificationRepository.DeleteNote(id);

    private async Task AnnounceRescheduling(CalendarEntry existing, CalendarEntry updated)
    {
        if (existing.Period == updated.Period || existing.AppointmentId is null)
        {
            return;
        }

        var contact = await retrievalRepository.GetAppointmentContact(existing.AppointmentId.Value);
        if (contact is null)
        {
            return;
        }

        integrationEvents.Add(new AppointmentRescheduled(contact.Value.Email, contact.Value.Language,
            existing.Period, updated.Period));
    }
}
