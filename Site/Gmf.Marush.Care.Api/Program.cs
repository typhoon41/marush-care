using Autofac;
using Gmf.Marush.Care.Api.Injection;
using Gmf.Marush.Care.Infrastructure.Data;
using Gmf.Net.Core.Common;
using Gmf.Net.Core.Common.Initialization;
using Gmf.Net.Core.Common.Initialization.Documentation;
using Gmf.Net.Core.Common.Initialization.Injection;
using Gmf.Net.Core.Common.Initialization.Middlewares;
using Microsoft.AspNetCore.Mvc;
using System.Resources;

[assembly: ApiController]
[assembly: NeutralResourcesLanguage("sr")]
var swaggerSettings = new OpenApiSettings
{
    Email = "office@marushcare.com",
    Location = "https://marushcare.com",
    ApiDetails = new ApiDetails { Description = "Marush - Space of care API V1", Version = "v1" },
    Title = "Marush - Space of care API",
    Description = "API supports all requests needed for \"Marush - Space of care\" website to work properly."
};

new ApiRunner(args)
    .ConfigureServices(ServiceCallback)
    .ConfigureContainer(ContainerCallback)
    .ConfigureApplication(ApplicationCallback)
    .Run();

void ApplicationCallback(WebApplicationBuilder builder, WebApplication application)
{
    _ = application.UseMiddleware<LocalizationMiddleware>(new List<string>() { "sr", "en", "ru" });
    //app.UseDefaultFiles();
    //app.UseStaticFiles(new StaticFileOptions
    //{
    //    OnPrepareResponse = context =>
    //    {
    //        if (context.File.Name != "index.html")
    //        {
    //            context.Context.Response.Headers.Append("Cache-Control", "public, max-age: 604800");
    //        }
    //    }
    //});

    //app.MapFallbackToFile("index.html");

    application.UseSwaggerIn(builder.Environment, swaggerSettings.ApiDetails);
}

static void ContainerCallback(HostBuilderContext context, ContainerBuilder builder)
{
    builder.RegisterModules();
}

void ServiceCallback(WebApplicationBuilder builder)
{
    var marushAssembly = new AssemblyFinder("Gmf.Marush.Care");
    builder.AddSqlServerDbContext<MarushCareContext>("MarushCare");
    _ = builder.Services.AddCors();
    _ = builder.Services.AddAutoMapper(marushAssembly.Api);
    _ = builder.Services.AddMvc([], marushAssembly.Api);

    builder.Services.AddSwaggerIn(builder.Environment, swaggerSettings);
}
