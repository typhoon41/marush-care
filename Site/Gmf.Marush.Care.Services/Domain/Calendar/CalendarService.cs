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
        if (await OverlapsExistingEntry(entry))
        {
            return CalendarEntrySaveOutcome.Overlapping;
        }

        await modificationRepository.AddEntry(entry);
        return CalendarEntrySaveOutcome.Saved;
    }

    public async Task<CalendarEntrySaveOutcome> UpdateEntry(Guid id, CalendarEntry entry)
    {
        var existing = await retrievalRepository.GetEntryById(id);
        if (existing is null)
        {
            return CalendarEntrySaveOutcome.NotFound;
        }

        if (await OverlapsExistingEntry(entry))
        {
            return CalendarEntrySaveOutcome.Overlapping;
        }

        await modificationRepository.UpdateEntry(id, entry);
        await AnnounceRescheduling(existing, entry);
        return CalendarEntrySaveOutcome.Saved;
    }

    public async Task<bool> DeleteEntry(Guid id) => await modificationRepository.DeleteEntry(id);

    public async Task UpsertNote(CalendarNote note) => await modificationRepository.UpsertNote(note);

    public async Task<bool> DeleteNote(Guid id) => await modificationRepository.DeleteNote(id);

    // The entry being saved is excluded, so an update never conflicts with its own stored period.
    private async Task<bool> OverlapsExistingEntry(CalendarEntry entry) =>
        (await retrievalRepository.GetEntriesOn(entry.Date))
            .Any(other => other.Id != entry.Id && other.Period.Overlaps(entry.Period));

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
