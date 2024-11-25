using Gmf.DDD.Common.Contracts;

namespace Gmf.Net.Core.Common.Persistence;
public class NoEventsDispatcher : IDispatchEvents<IDomainEvent>
{
    public Task Dispatch(IDomainEvent domainEvent) => Task.CompletedTask;
}
