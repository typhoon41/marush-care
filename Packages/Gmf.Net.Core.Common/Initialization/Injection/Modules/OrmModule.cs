﻿using System.Diagnostics.CodeAnalysis;
using Autofac;
using Gmf.Net.Core.Common.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Gmf.Net.Core.Common.Initialization.Injection.Modules;

[ExcludeFromCodeCoverage]
public class OrmModule<T> : Module where T : DbContext
{
    protected override void Load(ContainerBuilder builder)
    {
        ArgumentNullException.ThrowIfNull(builder);

        //builder.AncestorRegistration<T, DbContext>();
        builder.DefaultInterfaceRegistration<EntityFrameworkUnitOfWork<T>>();
    }
}
