using Gmf.DDD.Common.Contracts;
using System.Diagnostics.CodeAnalysis;

namespace Gmf.Net.Core.Common.Persistence;
public class EventsStore<TDomainEvent>([NotNull] IDispatchEvents<TDomainEvent> eventsDispatcher) : IStoreEvents<TDomainEvent>
{
    private readonly IDispatchEvents<TDomainEvent> _eventsDispatcher = eventsDispatcher ?? throw new ArgumentNullException(nameof(eventsDispatcher));
    private readonly Queue<TDomainEvent> _events = new();

    public void Add(TDomainEvent domainEvent) => _events.Enqueue(domainEvent);

    public async Task Publish()
    {
        while (_events.Any())
        {
            var nextEvent = _events.Dequeue();
            await _eventsDispatcher.Dispatch(nextEvent);
        }
    }
}
