namespace Gmf.DDD.Common.Contracts;
public interface IDispatchEvents<in TDomainEvent>
{
    Task Dispatch(TDomainEvent domainEvent);
}
