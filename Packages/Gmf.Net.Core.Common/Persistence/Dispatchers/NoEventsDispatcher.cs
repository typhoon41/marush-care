using Gmf.DDD.Common.Contracts;

namespace Gmf.Net.Core.Common.Persistence.Dispatchers;
public class NoEventsDispatcher : IDispatchEvents
{
    public Task Dispatch(IDomainEvent domainEvent) => Task.CompletedTask;
}
