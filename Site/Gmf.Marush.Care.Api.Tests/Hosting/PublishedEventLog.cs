using System.Collections.Concurrent;
using Gmf.DDD.Common.Contracts;

namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>Every domain event that reached the background handler, which happens only after a successful commit.</summary>
public sealed class PublishedEventLog
{
    private readonly ConcurrentQueue<IDomainEvent> _events = new();

    public IReadOnlyList<IDomainEvent> All => [.. _events];

    public void Record(IDomainEvent domainEvent) => _events.Enqueue(domainEvent);

    public async Task<TEvent> WaitFor<TEvent>(Func<TEvent, bool> matches) where TEvent : class, IDomainEvent =>
        await Polling.Until(() => All.OfType<TEvent>().FirstOrDefault(matches), $"a published {typeof(TEvent).Name}");
}
