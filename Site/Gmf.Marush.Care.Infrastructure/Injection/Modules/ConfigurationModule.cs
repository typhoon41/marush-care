using Autofac;
using Gmf.Mail.Common.Models;
using Gmf.Marush.Care.Infrastructure.Injection.Configuration;
using Gmf.Net.Core.Common.Configuration;
using Gmf.Net.Core.Common.Initialization.Injection;
using Gmf.Net.Core.Common.Security;
using Microsoft.Extensions.Configuration;

namespace Gmf.Marush.Care.Infrastructure.Injection.Modules;
public class ConfigurationModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.SingleSelfRegistration(c => c.Resolve<IConfiguration>().ResolveFrom<SmtpSettings>("Smtp"));
        builder.SingleSelfRegistration(c => c.Resolve<IConfiguration>().ResolveFrom<ContactSettings>("ContactInformation"));
        builder.SingleSelfRegistration(c => c.Resolve<IConfiguration>().ResolveFrom<DeveloperContact>("Developer"));
        builder.SingleSelfRegistration(c => c.Resolve<IConfiguration>().ResolveFrom<CaptchaSettings>("Captcha"));
    }
}
