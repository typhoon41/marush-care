using Autofac;
using Gmf.Marush.Care.Infrastructure.Data.Repositories;
using Gmf.Net.Core.Common.Initialization.Injection;

namespace Gmf.Marush.Care.Infrastructure.Injection.Modules;
public class RepositoryModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        builder.DefaultInterfaceRegistration<CustomerRepository>();
        builder.DefaultInterfaceRegistration<AppointmentRepository>();
        builder.DefaultInterfaceRegistration<UserRepository>();
    }
}
