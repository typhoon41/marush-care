using Autofac;
using Gmf.Mail.Common.Injection.Modules;
using Gmf.Marush.Care.Infrastructure.Data;
using Gmf.Marush.Care.Infrastructure.Injection.Modules;
using Gmf.Net.Core.Common.Initialization.Injection;
using Gmf.Net.Core.Common.Initialization.Injection.Modules;
using Gmf.Net.Core.Common.Persistence.Dispatchers;
using Gmf.Net.Core.Common.Persistence.Dispatchers.Storage;

namespace Gmf.Marush.Care.Api.Initialization;

internal static class InjectionExtensions
{
    internal static void RegisterModules(this ContainerBuilder builder)
    {
        builder.SingleInterfaceRegistration<InMemoryStorage>();
        builder.DefaultInterfaceRegistration<InMemoryEventsDispatcher>();
        builder.DefaultInterfaceRegistration<EventsStore>();
        _ = builder.RegisterModule<FiltersModule>();
        _ = builder.RegisterModule<ConfigurationModule>();
        _ = builder.RegisterModule<OrmModule<MarushCareContext>>();
        _ = builder.RegisterModule<RepositoryModule>();
        _ = builder.RegisterModule(new EmailModule(true));
        _ = builder.RegisterModule<ServiceModule>();

    }
}
