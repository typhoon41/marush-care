using System.Globalization;

namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>
/// The date and time text the API reads and writes. DateOnlyJsonConverter accepts only "d.M.yyyy.", "MM/dd/yyyy"
/// and "dd.MM.yyyy" (never ISO), and writes dates in the request culture, so "sr" answers "3.12.2026.".
/// </summary>
public static class WireFormat
{
    private static readonly CultureInfo Serbian = new("sr");

    public static string Date(DateOnly date) => date.ToString("dd.MM.yyyy", CultureInfo.InvariantCulture);

    public static string SerbianDate(DateOnly date) => date.ToString(Serbian);

    public static string Time(TimeOnly time) => time.ToString("HH:mm:ss", CultureInfo.InvariantCulture);
}
