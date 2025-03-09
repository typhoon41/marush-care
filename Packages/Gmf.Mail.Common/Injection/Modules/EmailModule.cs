using Autofac;
using Gmf.Mail.Common.Clients;
using Gmf.Mail.Common.Contracts;
using Gmf.Mail.Common.Models;
using Gmf.Mail.Common.Services;
using Gmf.Net.Core.Common.Initialization.Injection;
using Microsoft.Extensions.Logging;
using Module = Autofac.Module;

namespace Gmf.Mail.Common.Injection.Modules;
public class EmailModule(bool withTemplateSender) : Module
{
    private readonly bool _withTemplateSender = withTemplateSender;

    protected override void Load(ContainerBuilder builder)
    {
        _ = builder.Register(context =>
        {
            var smtpSettings = context.Resolve<SmtpSettings>();

            if (smtpSettings.UsePickupDirectory)
            {
                return new EmailClientStub(smtpSettings, context.Resolve<ILogger<EmailClientStub>>());
            }

            return (IEmailClient)new EmailClient(smtpSettings, context.Resolve<ILogger<EmailClient>>());
        }).InstancePerLifetimeScope();

        if (_withTemplateSender)
        {
            builder.DefaultInterfaceRegistration<EmailSender>();
        }
    }
}
