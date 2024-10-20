using Microsoft.AspNetCore.Http;
using System.Globalization;

namespace Gmf.Net.Core.Common.Initialization.Middlewares;

public class LocalizationMiddleware
{
    private readonly string _defaultCulture;
    private readonly RequestDelegate _next;
    private readonly IEnumerable<CultureInfo> _supportedCultures;

    public LocalizationMiddleware(RequestDelegate next, IList<string> supportedLanguages)
    {
        if (supportedLanguages == null || !supportedLanguages.Any())
        {
            throw new ArgumentException("There must be at least one supported language!", nameof(supportedLanguages));
        }

        _next = next;
        _defaultCulture = supportedLanguages.First();
        _supportedCultures = supportedLanguages.Select(language => new CultureInfo(language));
    }


    public async Task InvokeAsync(HttpContext context)
    {
        var found = GetRequestCultureFrom(context);
        SetCurrentCulture(found);

        await _next(context);
    }

    private CultureInfo GetRequestCultureFrom(HttpContext context)
    {
        const string languageHeaderKey = "Accept-Language";
        var languageHeader = context.Request.Headers[languageHeaderKey];
        return GetCultureByName(languageHeader.SingleOrDefault() ?? string.Empty);
    }

    private CultureInfo GetCultureByName(string name) => _supportedCultures.SingleOrDefault(culture => culture.Name == name) ??
               _supportedCultures.Single(culture => culture.Name == _defaultCulture);

    private static void SetCurrentCulture(CultureInfo given)
    {
        CultureInfo.CurrentCulture = given;
        CultureInfo.CurrentUICulture = given;
    }
}
