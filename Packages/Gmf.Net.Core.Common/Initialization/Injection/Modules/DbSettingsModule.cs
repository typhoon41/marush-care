using Autofac;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;

namespace Gmf.Net.Core.Common.Initialization.Injection.Modules;

[ExcludeFromCodeCoverage]
public class DbSettingsModule(string connectionStringName, bool sensitiveDataLoggingEnabled) : Module
{
    private readonly string _connectionStringName = connectionStringName ?? throw new ArgumentNullException(nameof(connectionStringName));

    protected override void Load(ContainerBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);
        builder.SingleSelfRegistration(CreateDbContextOptions);
    }

    private DbContextOptions CreateDbContextOptions(IComponentContext container)
    {
        var connectionString = container.Resolve<IConfiguration>().GetConnectionString(_connectionStringName);
        return ConfigureDbContext(container, connectionString!);
    }

    private DbContextOptions ConfigureDbContext(IComponentContext container, string connectionString)
    {
        var loggerFactory = container.Resolve<ILoggerFactory>();
        var optionsBuilder = new DbContextOptionsBuilder();

        _ = optionsBuilder.UseLoggerFactory(loggerFactory)
                      .EnableSensitiveDataLogging(sensitiveDataLoggingEnabled);

        _ = optionsBuilder.UseSqlServer(connectionString);
        return optionsBuilder.Options;
    }
}
