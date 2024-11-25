using System.Diagnostics.CodeAnalysis;

namespace Gmf.DDD.Common.Concepts;
public abstract class Entity<T>(T id) where T : struct
{
    public T Id { get; } = id;

    [ExcludeFromCodeCoverage]
    public override bool Equals(object? obj)
    {
        if (obj is not Entity<T> model)
        {
            return false;
        }

        var typeMatches = GetType() == model.GetType();
        return typeMatches && model.Id.Equals(Id);
    }

    [ExcludeFromCodeCoverage]
    public override int GetHashCode() => Id.GetHashCode();
}
