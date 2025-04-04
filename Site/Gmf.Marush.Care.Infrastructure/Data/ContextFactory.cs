﻿using Gmf.Net.Core.Common.Persistence.Dispatchers;
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

        return new MarushCareContext(new NoEventsDispatcher(), new EventsStore(new NoEventsDispatcher()), optionsBuilder.Options);
    }
}
