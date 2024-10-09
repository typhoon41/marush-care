using System.Reflection;

namespace Gmf.Net.Core.Common.Initialization;

public class AssemblyFinder(string projectPrefix)
{
    private readonly string _projectPrefix = projectPrefix ?? throw new ArgumentNullException(nameof(projectPrefix));

    public Assembly Api => FindAssembly("Api");
    public Assembly Infrastructure => FindAssembly("Infrastructure");

    private Assembly FindAssembly(string projectSuffix) => Assembly.Load($"{_projectPrefix}.{projectSuffix}");
}