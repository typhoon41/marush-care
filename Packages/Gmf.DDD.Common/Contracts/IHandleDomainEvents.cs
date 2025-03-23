namespace Gmf.DDD.Common.Contracts;

public interface IHandleDomainEvents
{
    Task Handle(IDomainEvent notification, CancellationToken cancellationToken = default);
}
