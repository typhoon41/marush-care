using Autofac;
using Gmf.Marush.Care.Infrastructure.Services;
using Gmf.Net.Core.Common.Initialization.Injection;

namespace Gmf.Marush.Care.Infrastructure.Injection.Modules;

public class ServiceModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        builder.DefaultInterfaceRegistration<AppointmentNotificationService>();
    }
}
