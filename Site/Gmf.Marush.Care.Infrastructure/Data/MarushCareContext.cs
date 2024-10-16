using Gmf.DDD.Common.Contracts;
using Gmf.Net.Core.Common.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace Gmf.Marush.Care.Infrastructure.Data;

[ExcludeFromCodeCoverage]
public class MarushCareContext(IDispatchEvents<IDomainEvent> eventsDispatcher,
    IStoreEvents<IDomainEvent> eventsStore, DbContextOptions options) : BaseDbContext<IDomainEvent>(eventsDispatcher, eventsStore, options),
    IDesignTimeDbContextFactory<MarushCareContext>
{
    protected override Assembly CurrentAssembly => typeof(MarushCareContext).Assembly;

    public MarushCareContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<MarushCareContext>();
        _ = optionsBuilder.UseSqlServer(configuration.GetConnectionString("MarushCareContext")!);

        return new MarushCareContext(new EventsDispatcherStub(), new EventsStore<IDomainEvent>(new EventsDispatcherStub()), optionsBuilder.Options);
    }
}
