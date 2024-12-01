using Autofac;
using Gmf.Marush.Care.Infrastructure.Services;
using Gmf.Marush.Care.Services.Domain.Appointment;
using Gmf.Net.Core.Common.Initialization;
using Gmf.Net.Core.Common.Initialization.Injection;

namespace Gmf.Marush.Care.Infrastructure.Injection.Modules;

public class ServiceModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        _ = builder.Register(context => new CultureResolver(["sr", "en", "ru"])).InstancePerLifetimeScope();
        builder.DefaultInterfaceRegistration<AppointmentNotificationService>();
        builder.DefaultInterfaceRegistration<Service>();
    }
}
