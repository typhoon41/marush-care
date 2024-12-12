using Gmf.Net.Core.Common.Initialization.Http;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace Gmf.Net.Core.Common.Security;

public sealed class ValidateCaptchaAttribute : ActionFilterAttribute
{
    private const string CaptchaHeader = "Captcha";
    private const string CaptchaAction = "CaptchaAction";
    private const double Threshold = 0.25;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly CaptchaSettings _settings;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<ValidateCaptchaAttribute> _logger;

    public ValidateCaptchaAttribute(IHttpClientFactory httpClientFactory, CaptchaSettings settings, IWebHostEnvironment environment,
        ILogger<ValidateCaptchaAttribute> logger)
    {
        _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
        _settings = settings ?? throw new ArgumentNullException(nameof(settings));
        _environment = environment ?? throw new ArgumentNullException(nameof(environment));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public override async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(next);

        if (_environment.IsDevelopment())
        {
            _ = await next();
            return;
        }

        var captchaHeader = context.HttpContext.Request.Headers[CaptchaHeader];
        var captchaAction = context.HttpContext.Request.Headers[CaptchaAction];

        if (!captchaHeader.Any() || !captchaAction.Any())
        {
            _logger.LogDebug("Missing captcha headers. Returning status code 400...");
            context.Result = new BadRequestResult();
            return;
        }

        var url = GetUrlFrom(_settings);
        _logger.LogDebug("Sending captcha validation to {Url}", url);
        using var httpClient = _httpClientFactory.CreateClient();
        var input = new Request()
        {
            Event = new RequestBody
            {
                ExpectedAction = captchaAction.First()!,
                SiteKey = _settings.ClientKey,
                Token = captchaHeader.First()!
            }
        };
        var result = await httpClient.PostWithResponseAsync<Request, Response>(url, input);

        if (!result.Success || result.Score < Threshold)
        {
            _logger.LogDebug("Captcha validation failed due to low result score of {Score}.", result.Score);
            context.Result = new BadRequestResult();
            return;
        }

        _ = await next();
    }

    private static string GetUrlFrom(CaptchaSettings settings) =>
        $"https://recaptchaenterprise.googleapis.com/v1/projects/{settings.ProjectName}/assessments?key={settings.ApiKey}";
}
