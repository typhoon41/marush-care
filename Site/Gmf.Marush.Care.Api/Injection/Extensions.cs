using Autofac;
using Gmf.DDD.Common.Contracts;
using Gmf.Mail.Common.Injection.Modules;
using Gmf.Marush.Care.Infrastructure.Data;
using Gmf.Marush.Care.Infrastructure.Injection.Modules;
using Gmf.Net.Core.Common.Initialization.Injection;
using Gmf.Net.Core.Common.Initialization.Injection.Modules;
using Gmf.Net.Core.Common.Persistence;

namespace Gmf.Marush.Care.Api.Injection;

internal static class Extensions
{
    internal static void RegisterModules(this ContainerBuilder builder)
    {
        builder.DefaultInterfaceRegistration<NoEventsDispatcher>();
        builder.DefaultInterfaceRegistration<EventsStore<IDomainEvent>>();
        _ = builder.RegisterModule<ConfigurationModule>();
        _ = builder.RegisterModule<OrmModule<MarushCareContext>>();
        _ = builder.RegisterModule<RepositoryModule>();
        _ = builder.RegisterModule(new EmailModule(true));
        _ = builder.RegisterModule<ServiceModule>();

    }
}
