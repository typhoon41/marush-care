namespace Gmf.Marush.Care.Api.Models;

internal static class StringExtensions
{
    internal static string ToFormattedPhone(this string phone)
    {
        var formatted = phone.Replace("+381", "0", StringComparison.InvariantCultureIgnoreCase);
        return formatted.Insert(3, "/").Insert(7, "-").Insert(10, "-");
    }
}
