using Gmf.DDD.Common.Contracts;

namespace Gmf.Net.Core.Common.Persistence;
public class EventsDispatcherStub : IDispatchEvents<IDomainEvent>
{
    public Task Dispatch(IDomainEvent domainEvent) => Task.CompletedTask;
}
