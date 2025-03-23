using Gmf.Net.Core.Common.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Serilog;

namespace Gmf.Net.Core.Common;
public abstract class ApplicationRunner()
{
    protected WebApplicationBuilder? Builder { get; private set; }

    public void RunWith(WebApplicationOptions options)
    {
        try
        {
            Builder = WebApplication.CreateBuilder(options);
            new SerilogLogger(Builder).ConfigureBootstrap();
            Log.Information($"Starting API host in {Builder.Environment.EnvironmentName} environment.");

            _ = Builder.WebHost.ConfigureKestrel(settings => settings.AddServerHeader = false);
            _ = Builder.Host.UseSerilog(new SerilogLogger(Builder).Configure());
            OnApplicationRun();
        }

        catch (Exception exception)
        {
            Log.Fatal(exception, "Host terminated unexpectedly");
            throw;
        }

        finally
        {
            Log.Information("Stopping web host");
            Log.CloseAndFlush();
        }
    }

    protected abstract void OnApplicationRun();
}
