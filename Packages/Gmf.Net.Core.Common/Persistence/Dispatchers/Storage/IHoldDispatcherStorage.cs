using Gmf.DDD.Common.Contracts;

namespace Gmf.Net.Core.Common.Persistence.Dispatchers.Storage;

public interface IHoldDispatcherStorage
{
    Task EnqueueAsync(IDomainEvent message);
    Task<IDomainEvent> DequeueAsync();
    IAsyncEnumerable<IDomainEvent> ReadAllAsync();
}
