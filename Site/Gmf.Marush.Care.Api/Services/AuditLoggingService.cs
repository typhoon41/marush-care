using System.Diagnostics.CodeAnalysis;
using Gmf.DDD.Common.Contracts;
using Gmf.Net.Core.Common.Persistence.Dispatchers.Storage;

namespace Gmf.Marush.Care.Api.Services;

[SuppressMessage("Maintainability", "CA1515:Consider making public types internal",
    Justification = "Has to be public due to reachability through DI")]
public class AuditLoggingService(IHoldDispatcherStorage storage, IHandleDomainEvents handler, ILogger<AuditLoggingService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var message in storage.ReadAllAsync().WithCancellation(stoppingToken))
        {
            try
            {
                await handler.Handle(message, stoppingToken);
            }
            catch (Exception exception)
            {
                logger.LogError(exception, "Audit message could not be processed! Reason: {Message}", exception.Message);
            }
        }
    }
}
