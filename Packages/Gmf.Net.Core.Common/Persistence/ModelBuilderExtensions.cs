using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;
using System.Reflection;

namespace Gmf.Net.Core.Common.Persistence;
[ExcludeFromCodeCoverage]
internal static class ModelBuilderExtensions
{
    internal static MethodInfo GetEntityMethod(this ModelBuilder builder)
    {
        const string entity = "Entity";
        var info = builder.GetType()
            .GetTypeInfo();

        return info.GetMethods()
            .Single(method => method.Name == entity &&
                              method.IsGenericMethod &&
                              method.GetParameters().Length == 0);
    }
}
