using Autofac;
using Gmf.Marush.Care.Infrastructure.Data.Repositories;
using Gmf.Net.Core.Common.Initialization.Injection;

namespace Gmf.Marush.Care.Infrastructure.Injection.Modules;
public class RepositoryModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        builder.DefaultInterfaceRegistration<CustomerModificationRepository>();
        builder.DefaultInterfaceRegistration<CustomerRetrievalRepository>();
        builder.DefaultInterfaceRegistration<AppointmentRepository>();
        builder.DefaultInterfaceRegistration<UserRepository>();
    }
}
