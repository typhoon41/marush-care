using Gmf.DDD.Common.Contracts;

namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>Decorates the API's own handler, so audit logging and reschedule emails still run.</summary>
public sealed class RecordingDomainEventsHandler(IHandleDomainEvents handler, PublishedEventLog log) : IHandleDomainEvents
{
    public async Task Handle(IDomainEvent notification, CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(notification);
        log.Record(notification);
        await handler.Handle(notification, cancellationToken);
    }
}
