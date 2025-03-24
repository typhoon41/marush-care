using System.Diagnostics.CodeAnalysis;
using Autofac;
using Gmf.Net.Core.Common.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Gmf.Net.Core.Common.Initialization.Injection.Modules;

[ExcludeFromCodeCoverage]
public class OrmModule<T> : Module where T : DbContext
{
    protected override void Load(ContainerBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        _ = builder.Register(c =>
            c.Resolve<IServiceProvider>().GetRequiredService<T>()).As<DbContext>().InstancePerLifetimeScope();
        builder.DefaultInterfaceRegistration<EntityFrameworkUnitOfWork<T>>();
    }
}
