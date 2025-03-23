using Gmf.DDD.Common.Contracts;
using Gmf.Net.Core.Common.Persistence.Dispatchers.Storage;

namespace Gmf.Net.Core.Common.Persistence.Dispatchers;

public class InMemoryEventsDispatcher(IHoldDispatcherStorage inMemoryStore) : IDispatchEvents
{
    public async Task Dispatch(IDomainEvent domainEvent) => await inMemoryStore.EnqueueAsync(domainEvent);
}
