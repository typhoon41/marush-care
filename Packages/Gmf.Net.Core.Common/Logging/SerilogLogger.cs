using Gmf.Net.Core.Common.Configuration;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using System.Diagnostics.CodeAnalysis;

namespace Gmf.Net.Core.Common.Logging;

internal class SerilogLogger
{
    private readonly string _logFilePath;
    private readonly LogEventLevel _defaultLogLevel;

    internal SerilogLogger(WebApplicationBuilder? builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        _defaultLogLevel = builder.Environment.IsDevelopment() ? LogEventLevel.Debug : LogEventLevel.Warning;
        _logFilePath = builder.Configuration.ResolveFrom<string>("App:LogPath");
    }

    [SuppressMessage("Globalization", "CA1305:Specify IFormatProvider",
        Justification = "False positive. Requested specification like this in official documentation.")]
    internal void Configure()
    {
        var configuration = new LoggerConfiguration().MinimumLevel
            .Debug().MinimumLevel
            .Override("Microsoft", _defaultLogLevel).MinimumLevel
            .Override("Microsoft.EntityFrameworkCore", _defaultLogLevel).MinimumLevel
            .Override("System", _defaultLogLevel)
            .WriteTo.File(_logFilePath, rollingInterval: RollingInterval.Day, shared: true,
                outputTemplate: "[{Timestamp:HH:mm:ss.FFF} {Level}]: {Message:lj}{NewLine}{Exception}")
            .ReadFrom.Configuration(ConfigurationRetriever.Current);
        _ = configuration.Enrich.FromLogContext();
        Log.Logger = configuration.CreateLogger();
    }
}
