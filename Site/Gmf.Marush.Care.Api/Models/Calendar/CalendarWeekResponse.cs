namespace Gmf.Marush.Care.Api.Models.Calendar;
public record CalendarWeekResponse(
    DateOnly WeekStart,
    IEnumerable<CalendarEntryResponse> Entries,
    IEnumerable<PublicAppointmentResponse> PublicAppointments,
    IEnumerable<CalendarNoteResponse> Notes);

public record CalendarEntryResponse(
    Guid Id,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime,
    string? ClientName,
    string? ClientPhone,
    string? ClientEmail,
    Guid? CustomerId,
    string? Notes,
    decimal? Money);

public record PublicAppointmentResponse(
    Guid Id,
    DateOnly Date,
    TimeOnly StartTime,
    TimeOnly EndTime,
    string ClientName,
    string Phone,
    string Email,
    string Status,
    string? Description);

public record CalendarNoteResponse(Guid Id, DateOnly Date, string NoteType, string Content);
