﻿using Gmf.DDD.Common.Contracts;
using Gmf.DDD.Common.Persistance;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace Gmf.Net.Core.Common.Persistence;

public abstract class BaseDbContext<TDomainEvent> : DbContext
{
    private readonly IDispatchEvents<TDomainEvent> _eventsDispatcher;
    private readonly IStoreEvents<TDomainEvent> _eventsStore;

    protected BaseDbContext([NotNull] IDispatchEvents<TDomainEvent> eventsDispatcher,
        [NotNull] IStoreEvents<TDomainEvent> eventsStore, DbContextOptions options) : base(options)
    {
        _eventsDispatcher = eventsDispatcher ?? throw new ArgumentNullException(nameof(eventsDispatcher));
        _eventsStore = eventsStore ?? throw new ArgumentNullException(nameof(eventsStore));
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var domainEvents = GatherDomainEvents();
        var result = await base.SaveChangesAsync(cancellationToken);

        foreach (var @event in domainEvents)
        {
            await Dispatch(@event);
        }

        // Publish integration events that have nothing to do with entity modifications.
        await Publish();
        return result;
    }

    private async Task Dispatch(TDomainEvent @event) => await _eventsDispatcher.Dispatch(@event);

    private async Task Publish() => await _eventsStore.Publish();

    private IEnumerable<TDomainEvent> GatherDomainEvents()
    {
        var entries = ChangeTracker.Entries<EntityDto<TDomainEvent>>()
            .Where(x => x.Entity.DomainEvents.Any())
            .ToList();
        var domainEvents = entries.SelectMany(x => x.Entity.DomainEvents)
            .ToList();
        entries.ToList()
        .ForEach(entry => entry.Entity.ClearDomainEvents());

        return domainEvents;
    }

    protected abstract Assembly CurrentAssembly { get; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        ArgumentNullException.ThrowIfNull(modelBuilder);

        _ = modelBuilder.ApplyConfigurationsFromAssembly(CurrentAssembly);
        RegisterEntities(modelBuilder);
        base.OnModelCreating(modelBuilder);
    }

    private void RegisterEntities(ModelBuilder modelBuilder)
    {
        var entityMethod = modelBuilder.GetEntityMethod();
        var entityTypes = CurrentAssembly.GetTypes()
            .Where(x => x.IsSubclassOf(typeof(EntityDto<TDomainEvent>)) && !x.IsAbstract);
        foreach (var type in entityTypes)
        {
            _ = entityMethod.MakeGenericMethod(type).Invoke(modelBuilder, []);
        }
    }
}
