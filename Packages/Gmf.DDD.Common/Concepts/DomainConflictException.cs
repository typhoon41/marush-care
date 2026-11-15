namespace Gmf.DDD.Common.Concepts;

/// <summary>A request that cannot be carried out because it conflicts with the current state of the domain.</summary>
public abstract class DomainConflictException(string message) : Exception(message);
