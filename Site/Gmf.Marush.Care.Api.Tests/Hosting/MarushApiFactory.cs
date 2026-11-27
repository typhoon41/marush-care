using Autofac;
using Gmf.DDD.Common.Contracts;
using Gmf.Mail.Common.Contracts;
using Gmf.Marush.Care.Api.Services;
using Gmf.Marush.Care.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Gmf.Marush.Care.Api.Tests.Hosting;

/// <summary>
/// Hosts the real API (Program, ApiRunner, Autofac modules, filters, validators) in memory. Only the edges change:
/// SQL Server becomes an EF Core InMemory database private to this factory, emails go to EmailClientStub's pickup
/// directory (a temporary folder) and are recorded on the way, the Node.js SSR process is not started, and published
/// domain events are recorded on their way to the real handler. The environment is "Test", the name the test
/// deployment uses, so captcha is skipped (it runs only in Production). Configuration: appsettings.Test.json.
/// </summary>
public sealed class MarushApiFactory : WebApplicationFactory<Program>
{
    public const string EnvironmentName = "Test";
    public const string OwnerAddress = "owner@marush.test";
    public const string DeveloperAddress = "developer@marush.test";

    private readonly string _databaseName = $"marush-api-tests-{Guid.NewGuid():N}";
    private readonly string _pickupDirectory = Path.Combine(Path.GetTempPath(), "marush-api-tests", Guid.NewGuid().ToString("N"));

    public EmailOutbox Emails { get; } = new();

    public PublishedEventLog PublishedEvents { get; } = new();

    // HTTPS as in production; the pipeline ends with UseHttpsRedirection, which an unmatched HTTP request would reach.
    public MarushApiClient CreateApiClient(string language = "sr") => new(CreateClient(new WebApplicationFactoryClientOptions
    {
        AllowAutoRedirect = false,
        BaseAddress = new Uri("https://localhost")
    }), language);

    public async Task<T> QueryDatabase<T>(Func<MarushCareContext, Task<T>> query)
    {
        ArgumentNullException.ThrowIfNull(query);
        using var scope = Services.CreateScope();
        return await query(scope.ServiceProvider.GetRequiredService<MarushCareContext>());
    }

    public async Task ChangeDatabase(Func<MarushCareContext, Task> change)
    {
        ArgumentNullException.ThrowIfNull(change);
        using var scope = Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<MarushCareContext>();
        await change(context);
        _ = await context.SaveChangesAsync(TestContext.Current.CancellationToken);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        _ = builder.UseEnvironment(EnvironmentName);
        _ = builder.UseContentRoot(Directory.GetCurrentDirectory());
        _ = builder.UseSetting("Smtp:PickupDirectoryLocation", _pickupDirectory);
        _ = builder.ConfigureTestServices(ReplaceExternalServices);
    }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);
        // ConfigureTestContainer is ignored under minimal hosting; this callback runs after Program's own ConfigureContainer.
        _ = builder.ConfigureContainer<ContainerBuilder>((_, container) => RecordOutgoingTraffic(container));
        var host = base.CreateHost(builder);
        using var scope = host.Services.CreateScope();
        // InMemory applies HasData on EnsureCreated, which seeds the four AppointmentStatus rows.
        _ = scope.ServiceProvider.GetRequiredService<MarushCareContext>().Database.EnsureCreated();
        return host;
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        if (disposing && Directory.Exists(_pickupDirectory))
        {
            Directory.Delete(_pickupDirectory, true);
        }
    }

    private void ReplaceExternalServices(IServiceCollection services)
    {
        var sqlServerRegistrations = services
            .Where(descriptor => descriptor.ServiceType == typeof(DbContextOptions<MarushCareContext>)
                                 || descriptor.ServiceType == typeof(DbContextOptions)
                                 || descriptor.ServiceType == typeof(IDbContextOptionsConfiguration<MarushCareContext>));
        // Outside Development, Program.cs starts the Node.js SSR server; the API tests never need it.
        var nodeRunner = services.Where(descriptor => descriptor.ImplementationType == typeof(NodeJsRunnerService));
        foreach (var registration in sqlServerRegistrations.Concat(nodeRunner).ToList())
        {
            _ = services.Remove(registration);
        }

        _ = services.AddDbContext<MarushCareContext>(options => options.UseInMemoryDatabase(_databaseName));
    }

    private void RecordOutgoingTraffic(ContainerBuilder container)
    {
        _ = container.RegisterInstance(Emails).AsSelf();
        _ = container.RegisterInstance(PublishedEvents).AsSelf();
        container.RegisterDecorator<RecordingEmailClient, IEmailClient>();
        container.RegisterDecorator<RecordingDomainEventsHandler, IHandleDomainEvents>();
    }
}
