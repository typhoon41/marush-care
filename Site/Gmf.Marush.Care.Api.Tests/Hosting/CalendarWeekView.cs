using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json;

namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>The JSON of GET api/calendar/week, as the admin calendar receives it.</summary>
public sealed class CalendarWeekView
{
    private readonly JsonElement _week;

    private CalendarWeekView(JsonElement week) => _week = week;

    public static async Task<CalendarWeekView> Load(MarushApiClient staff, DateOnly day)
    {
        ArgumentNullException.ThrowIfNull(staff);
        using var response = await staff.Get($"api/calendar/week?weekStart={day.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture)}");
        _ = response.EnsureSuccessStatusCode();
        return new CalendarWeekView(await response.Content.ReadFromJsonAsync<JsonElement>(TestContext.Current.CancellationToken));
    }

    public IEnumerable<JsonElement> Entries => _week.GetProperty("entries").EnumerateArray();

    public IEnumerable<JsonElement> PublicAppointments => _week.GetProperty("publicAppointments").EnumerateArray();

    public (string? Start, string? End) EntryTimes(Guid appointmentId) =>
        Times(Entries.Single(entry => entry.GetProperty("appointmentId").GetGuid() == appointmentId));

    public (string? Start, string? End) RequestTimes(Guid appointmentId) =>
        Times(PublicAppointments.Single(request => request.GetProperty("id").GetGuid() == appointmentId));

    private static (string? Start, string? End) Times(JsonElement item) =>
        (item.GetProperty("startTime").GetString(), item.GetProperty("endTime").GetString());
}
