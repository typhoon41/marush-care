using Autofac;
using Gmf.Mail.Common.Models;
using Gmf.Net.Core.Common.Configuration;
using Microsoft.Extensions.Configuration;

namespace Gmf.Marush.Care.Infrastructure.Injection.Modules;
public class ConfigurationModule : Module
{
    protected override void Load(ContainerBuilder builder) => builder.Register(c => c.Resolve<IConfiguration>()
                                                                                          .ResolveFrom<SmtpSettings>("Smtp"))
               .AsSelf()
               .SingleInstance();
}
