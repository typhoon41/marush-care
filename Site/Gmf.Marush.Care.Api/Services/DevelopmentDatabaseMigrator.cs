using System.Diagnostics.CodeAnalysis;
using Gmf.Marush.Care.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Api.Services;

/// <summary>
/// Brings the development database up to date before the API starts listening; EF Core then runs the
/// development seeding registered on the context. Deployed environments migrate through the pipeline instead.
/// </summary>
[SuppressMessage("Maintainability", "CA1515:Consider making public types internal",
    Justification = "Has to be public due to reachability through DI")]
public class DevelopmentDatabaseMigrator(IServiceScopeFactory scopeFactory, ILogger<DevelopmentDatabaseMigrator> logger) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await using var scope = scopeFactory.CreateAsyncScope();
        var context = scope.ServiceProvider.GetRequiredService<MarushCareContext>();
        logger.LogInformation("Applying migrations and development seed data...");
        await context.Database.MigrateAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
