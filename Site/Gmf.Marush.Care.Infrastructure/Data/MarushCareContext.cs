using Gmf.DDD.Common.Contracts;
using Gmf.Net.Core.Common.Persistence;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace Gmf.Marush.Care.Infrastructure.Data;

[ExcludeFromCodeCoverage]
public class MarushCareContext(IDispatchEvents<IDomainEvent> eventsDispatcher,
    IStoreEvents<IDomainEvent> eventsStore, DbContextOptions options) : BaseDbContext<IDomainEvent>(eventsDispatcher, eventsStore, options)
{
    protected override Assembly CurrentAssembly => typeof(MarushCareContext).Assembly;
}
