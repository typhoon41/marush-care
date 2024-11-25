namespace Gmf.DDD.Common.Contracts;
public interface IDomainEvent
{
    string Name { get; }
    dynamic Data { get; }
}
