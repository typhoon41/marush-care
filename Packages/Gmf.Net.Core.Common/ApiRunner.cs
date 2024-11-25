using Autofac;
using Autofac.Extensions.DependencyInjection;
using Gmf.Net.Core.Common.Initialization;
using Gmf.Net.Core.Common.Initialization.Exceptions;
using Gmf.Net.Core.Common.Initialization.Http;
using Gmf.Net.Core.Common.Initialization.Middlewares;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Gmf.Net.Core.Common;

public class ApiRunner(string[] arguments) : ApplicationRunner(arguments)
{
    private Action<HostBuilderContext, ContainerBuilder> _withGivenConfiguration = (context, builder) => { };
    private Action<WebApplicationBuilder> _configureServicesWith = builder => { };
    private Action<WebApplicationBuilder, WebApplication> _configureApplicationWith = (builder, application) => { };

    protected override void OnApplicationRun(WebApplicationBuilder builder)
    {
        _ = builder.Host.UseServiceProviderFactory(new AutofacServiceProviderFactory());
        _ = builder.Host.ConfigureContainer(_withGivenConfiguration);
        _configureServicesWith(builder);
        builder.UseAspireServiceDiscovery();


        var application = builder.Build();
        _ = application.MapDefaultEndpoints();

        _configureApplicationWith(builder, application);

        application.Run();
    }

    public ApiRunner ConfigureContainer(Action<HostBuilderContext, ContainerBuilder> configureContainer)
    {
        _withGivenConfiguration = (host, containerBuilder) =>
        {
            containerBuilder.ComponentRegistryBuilder.Registered += (sender, args) =>
                args.ComponentRegistration.PipelineBuilding += (pipelineSender, pipelineArgs) =>
                    pipelineArgs.Use(new AutofacExceptionMiddleware());
            configureContainer(host, containerBuilder);
        };
        return this;
    }

    public ApiRunner ConfigureServices(Action<WebApplicationBuilder> configureServices)
    {
        _configureServicesWith = (webBuilder) =>
        {
            configureServices(webBuilder);
            webBuilder.Services.AddHttpsSecurity();
            _ = webBuilder.Services.AddHttpContextAccessor();
            _ = webBuilder.Services.AddRouting(options => options.LowercaseUrls = true);
            // Must be PostConfigure due to: https://github.com/aspnet/Mvc/issues/7858
            _ = webBuilder.Services.PostConfigure<ApiBehaviorOptions>(options => options.FluentValidationBehavior());
        };
        return this;
    }

    public ApiRunner ConfigureApplication(Action<WebApplicationBuilder, WebApplication> configureApplication)
    {
        _configureApplicationWith = (builder, application) =>
        {
            _ = application.UseRouting();
            _ = application.MapControllers();
            configureApplication(builder, application);
            _ = application.UseEndpoints(endpoints => endpoints.MapDefaultControllerRoute());
            _ = application.UseHttpsRedirection();
            application.UseExceptionsHandler();
            application.ConfigureFluentValidation();
        };

        return this;
    }
}
