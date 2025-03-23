﻿using System.Threading.Channels;
using Gmf.DDD.Common.Contracts;

namespace Gmf.Net.Core.Common.Persistence.Dispatchers.Storage;

public class InMemoryStorage : IHoldDispatcherStorage
{
    private readonly Channel<IDomainEvent> _channel;

    public InMemoryStorage()
    {
        _channel = Channel.CreateUnbounded<IDomainEvent>();
    }

    public async Task EnqueueAsync(IDomainEvent message) => await _channel.Writer.WriteAsync(message);

    public async Task<IDomainEvent> DequeueAsync() => await _channel.Reader.ReadAsync();

    public IAsyncEnumerable<IDomainEvent> ReadAllAsync() => _channel.Reader.ReadAllAsync();
}
