using Microsoft.Extensions.Configuration;
using System.Diagnostics.CodeAnalysis;

namespace Gmf.Net.Core.Common.Configuration;

[ExcludeFromCodeCoverage]
[SuppressMessage("Design", "CA1724:Type names should not match namespaces", Justification = "We don't care for naming clash between Autofac and Gmf code.")]
public static class Extensions
{
    public static T ResolveFrom<T>(this IConfiguration configuration, string sectionName)
    {
        var sectionSettings = configuration.GetSection(sectionName).Get<T>() ??
            throw new InvalidOperationException($"Section is missing from configuration. Section Name: {sectionName}");

        return sectionSettings;
    }
}
