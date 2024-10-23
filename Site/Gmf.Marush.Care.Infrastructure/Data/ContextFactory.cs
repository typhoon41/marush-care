using Gmf.DDD.Common.Contracts;
using Gmf.Net.Core.Common.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Gmf.Marush.Care.Infrastructure.Data;
public class ContextFactory : IDesignTimeDbContextFactory<MarushCareContext>
{
    public ContextFactory()
    {
    }

    public MarushCareContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(AppContext.BaseDirectory)
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<MarushCareContext>();
        _ = optionsBuilder.UseSqlServer(configuration.GetConnectionString("Database")!);

        return new MarushCareContext(new EventsDispatcherStub(), new EventsStore<IDomainEvent>(new EventsDispatcherStub()), optionsBuilder.Options);
    }
}
