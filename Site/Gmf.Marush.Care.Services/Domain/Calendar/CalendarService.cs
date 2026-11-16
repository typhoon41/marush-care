using Gmf.DDD.Common.Contracts;
using Gmf.Marush.Care.Domain.Contracts.Repositories;
using Gmf.Marush.Care.Domain.Contracts.Services;
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

    public async Task<bool> CreateEntry(CalendarEntry entry)
    {
        await Claim(new CalendarBooking(entry));
        return await modificationRepository.AddEntry(entry);
    }

    public async Task<bool> UpdateEntry(Guid id, CalendarEntry entry)
    {
        var existing = await retrievalRepository.GetEntryById(id);
        if (existing is null)
        {
            return false;
        }

        var booking = new CalendarBooking(entry, existing);
        await Claim(booking);
        if (!await modificationRepository.UpdateEntry(id, entry))
        {
            return false;
        }

        await AnnounceRescheduling(booking);
        return true;
    }

    public async Task<bool> DeleteEntry(Guid id) => await modificationRepository.DeleteEntry(id);

    public async Task UpsertNote(CalendarNote note) => await modificationRepository.UpsertNote(note);

    public async Task<bool> DeleteNote(Guid id) => await modificationRepository.DeleteNote(id);

    // The slot is looked up only for a booking that claims one.
    private async Task Claim(CalendarBooking booking) =>
        booking.Claim(booking.ClaimsSlot && await retrievalRepository.IsOccupied(booking));

    private async Task AnnounceRescheduling(CalendarBooking booking)
    {
        if (booking.MovedAppointmentId is not { } appointmentId)
        {
            return;
        }

        var contact = await retrievalRepository.GetAppointmentContact(appointmentId);
        if (contact is null)
        {
            return;
        }

        integrationEvents.Add(booking.Rescheduled(contact.Value.Email, contact.Value.Language));
    }
}
