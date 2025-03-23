using System.Diagnostics.CodeAnalysis;
using Autofac;
using Gmf.Net.Core.Common.Initialization.Filters;

namespace Gmf.Net.Core.Common.Initialization.Injection.Modules;

[ExcludeFromCodeCoverage]
public class FiltersModule : Module
{
    protected override void Load(ContainerBuilder builder)
    {
        builder.RegisterSelfLifetimeScope<RollbackTransactionFilter>();
        builder.RegisterSelfLifetimeScope<TransactionFilter>();
    }
}
