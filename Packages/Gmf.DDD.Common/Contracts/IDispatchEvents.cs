namespace Gmf.DDD.Common.Contracts;
public interface IDispatchEvents
{
    Task Dispatch(IDomainEvent domainEvent);
}
