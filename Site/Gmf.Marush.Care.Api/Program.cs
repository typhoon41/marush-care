#pragma warning disable CA1506 // Avoid excessive class coupling - this is a startup file and it is expected to have a lot of dependencies
using System.Resources;
using Autofac;
using Gmf.Marush.Care.Api.Initialization;
using Gmf.Marush.Care.Api.Services;
using Gmf.Marush.Care.Infrastructure.Data;
using Gmf.Net.Core.Common;
using Gmf.Net.Core.Common.Initialization;
using Gmf.Net.Core.Common.Initialization.Converters;
using Gmf.Net.Core.Common.Initialization.Documentation;
using Gmf.Net.Core.Common.Initialization.Injection;
using Gmf.Net.Core.Common.Initialization.Middlewares;
using Gmf.Net.Core.Common.Security;
using Microsoft.AspNetCore.Mvc;
using Serilog;

[assembly: ApiController]
[assembly: NeutralResourcesLanguage("sr")]
var swaggerSettings = new OpenApiSettings
{
    Email = "office@marushcare.com",
    Location = "https://marushcare.com",
    ApiDetails = new ApiDetails { Description = "Marush - Space of care API V1", Version = "v1" },
    Title = "Marush - Space of care API",
    Description = "API supports all requests needed for \"Marush - Space of care\" website to work properly.",
    OnConfiguringSwagger = (options) => options.SetupSwaggerSecurity()
};

new ApiRunner()
    .ConfigureServices(ServiceCallback)
    .ConfigureContainer(ContainerCallback)
    .ConfigureApplication(ApplicationCallback, FrontEndSetupCallback)
    .RunWith(new WebApplicationOptions
    {
        ApplicationName = typeof(Program).Assembly.FullName,
        ContentRootPath = Path.GetFullPath(Directory.GetCurrentDirectory()),
        WebRootPath = "dist/browser",
        Args = args
    });

void FrontEndSetupCallback(WebApplicationBuilder builder, WebApplication application)
{
    _ = application.UseDefaultFiles();
    _ = application.UseStaticFiles();
}

void ApplicationCallback(WebApplicationBuilder builder, WebApplication application)
{
    _ = application.UseMiddleware<LocalizationMiddleware>();
    _ = application.UseCors(builder => builder
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader());
    _ = application.UseAuthentication();
    _ = application.UseAuthorization();
    application.UseSwaggerIn(builder.Environment, swaggerSettings.ApiDetails);
    _ = application.UseSerilogRequestLogging();
}

static void ContainerCallback(WebApplicationBuilder appBuilder, ContainerBuilder builder)
{
    builder.RegisterModules();
}

void ServiceCallback(WebApplicationBuilder builder)
{
    var marushAssembly = new AssemblyFinder("Gmf.Marush.Care");
    builder.AddSqlServerDbContext<MarushCareContext>("MarushCare");
    _ = builder.Services.AddCors();
    _ = builder.Services.AddScoped(provider => new ValidateCaptchaAttribute(provider.GetService<IHttpClientFactory>()!,
            provider.GetService<CaptchaSettings>()!, builder.Environment, provider.GetService<ILogger<ValidateCaptchaAttribute>>()!));
    _ = builder.Services.AddAutoMapper(marushAssembly.Api);
    builder.AddAuthentication();
    _ = builder.Services.AddAuthorization();
    _ = builder.Services.AddMvc([], [new DateOnlyJsonConverter()], marushAssembly.Api);

    if (!builder.Environment.IsDevelopment())
    {
        _ = builder.Services.AddHostedService<NodeJsRunnerService>();
    }

    _ = builder.Services.AddHostedService<AuditLoggingService>();
    builder.Services.AddSwaggerIn(builder.Environment, swaggerSettings);
}
