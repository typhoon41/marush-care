using System.Diagnostics.CodeAnalysis;
using Gmf.DDD.Common.Contracts;
using Gmf.Net.Core.Common.Persistence.Handlers;

namespace Gmf.Marush.Care.Api.Services;

[SuppressMessage("Maintainability", "CA1515:Consider making public types internal",
    Justification = "Has to be public due to reachability through DI")]
public class DomainEventsHandler(AuditEventsHandler auditHandler,
    AppointmentRescheduledHandler reschedulingHandler) : IHandleDomainEvents
{
    public async Task Handle(IDomainEvent notification, CancellationToken cancellationToken = default)
    {
        await auditHandler.Handle(notification, cancellationToken);
        await reschedulingHandler.Handle(notification, cancellationToken);
    }
}
