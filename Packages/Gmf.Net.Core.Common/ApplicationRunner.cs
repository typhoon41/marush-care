using Gmf.Net.Core.Common.Logging;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Serilog;

namespace Gmf.Net.Core.Common;
public abstract class ApplicationRunner()
{
    public void RunWith(WebApplicationOptions options)
    {
        try
        {
            var builder = WebApplication.CreateBuilder(options);
            new SerilogLogger(builder).Configure();
            Log.Information($"Starting API host in {builder.Environment.EnvironmentName} environment.");

            _ = builder.WebHost.ConfigureKestrel(settings => settings.AddServerHeader = false);
            _ = builder.Host.UseSerilog();
            OnApplicationRun(builder);
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

    protected abstract void OnApplicationRun(WebApplicationBuilder builder);
}
