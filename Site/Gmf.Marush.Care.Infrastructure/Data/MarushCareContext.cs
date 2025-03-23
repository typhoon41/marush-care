using System.Diagnostics.CodeAnalysis;
using System.Reflection;
using Gmf.DDD.Common.Contracts;
using Gmf.Net.Core.Common.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Marush.Care.Infrastructure.Data;

[ExcludeFromCodeCoverage]
public class MarushCareContext(IDispatchEvents eventsDispatcher,
    IStoreEvents eventsStore, DbContextOptions options) : BaseDbContext(eventsDispatcher, eventsStore, options)
{
    protected override Assembly CurrentAssembly => typeof(MarushCareContext).Assembly;
}
