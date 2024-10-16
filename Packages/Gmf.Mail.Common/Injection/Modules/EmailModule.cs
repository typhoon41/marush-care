using Autofac;
using Gmf.Mail.Common.Clients;
using Gmf.Mail.Common.Contracts;
using Gmf.Mail.Common.Models;
using Microsoft.Extensions.Logging;
using Module = Autofac.Module;

namespace Gmf.Mail.Common.Injection.Modules;
public class EmailModule : Module
{
    protected override void Load(ContainerBuilder builder) =>
        builder.Register(context =>
        {
            var smtpSettings = context.Resolve<SmtpSettings>();

            if (smtpSettings.UsePickupDirectory)
            {
                return new EmailClientStub(smtpSettings, context.Resolve<ILogger<EmailClientStub>>());
            }

            return (IEmailClient)new EmailClient(smtpSettings, context.Resolve<ILogger<EmailClient>>());
        }).InstancePerLifetimeScope();
}
