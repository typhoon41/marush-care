using System.Diagnostics.CodeAnalysis;

namespace Gmf.DDD.Common.Concepts;
public abstract class Enumeration(int value, string displayName) : IComparable
{
    public int Value { get; } = value;

    public string DisplayName { get; } = displayName;

    public override string ToString() => DisplayName;

    [ExcludeFromCodeCoverage]
    public int CompareTo(object? obj)
    {
        if (obj == null)
        {
            throw new ArgumentNullException(nameof(obj));
        }

        return Value.CompareTo(((Enumeration)obj).Value);
    }

    [ExcludeFromCodeCoverage]
    public override bool Equals(object? obj)
    {
        if (obj is Enumeration otherValue)
        {
            var typeMatches = GetType() == obj.GetType();
            var valueMatches = Value.Equals(otherValue.Value);

            return typeMatches && valueMatches;
        }

        return false;
    }

    public override int GetHashCode() => HashCode.Combine(Value);

    public static bool operator ==(Enumeration lhs, Enumeration rhs)
    {
        return lhs is null ? rhs is null : lhs.Equals(rhs);
    }

    public static bool operator !=(Enumeration lhs, Enumeration rhs)
    {
        return !(lhs == rhs);
    }
}
